import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, prompt } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: "GEMINI_API_KEY is not configured in .env.local. Please add your Google Gemini API key to enable scraping."
      }, { status: 500 });
    }

    // Resolve paths
    const workspaceRoot = process.cwd();
    const pythonBinary = path.join(workspaceRoot, "venv", "bin", "python3");
    const scriptPath = path.join(workspaceRoot, "scripts", "scrape_profile.py");

    if (!fs.existsSync(pythonBinary)) {
      return NextResponse.json({
        error: "Python virtual environment not found. Please wait for the setup to complete."
      }, { status: 500 });
    }

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({
        error: "Scraping script not found at " + scriptPath
      }, { status: 500 });
    }

    // Build arguments
    const args = [scriptPath, url];
    if (prompt) {
      args.push("--prompt", prompt);
    }

    // Run the Python script in a Promise wrapper with a timeout
    const result = await new Promise((resolve, reject) => {
      const pyProcess = spawn(pythonBinary, args, {
        env: {
          ...process.env,
          // Explicitly pass GEMINI_API_KEY
          GEMINI_API_KEY: process.env.GEMINI_API_KEY
        }
      });

      let stdoutData = "";
      let stderrData = "";

      // Set a timeout of 120 seconds for scraping (scraping with browser loading & LLM can take time)
      const timer = setTimeout(() => {
        pyProcess.kill();
        reject(new Error("Scraping execution timed out after 120 seconds."));
      }, 120000);

      pyProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });

      pyProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
      });

      pyProcess.on("close", (code) => {
        clearTimeout(timer);
        if (code === 0) {
          resolve({ stdout: stdoutData, stderr: stderrData });
        } else {
          reject(new Error(`Python script exited with code ${code}. Error: ${stderrData}`));
        }
      });

      pyProcess.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    // Parse the JSON output from the Python script
    let scrapedProfile;
    try {
      // Find the JSON block if there's any logging noise in stdout
      const jsonStartIndex = result.stdout.indexOf("{");
      const jsonEndIndex = result.stdout.lastIndexOf("}");
      
      if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        throw new Error("No JSON object found in stdout");
      }

      const jsonString = result.stdout.substring(jsonStartIndex, jsonEndIndex + 1);
      scrapedProfile = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON parsing error on Python output:", result.stdout);
      return NextResponse.json({
        error: "Failed to parse scraper results. The output was not valid JSON.",
        details: result.stdout
      }, { status: 500 });
    }

    // Return the successfully scraped and mapped profile data
    return NextResponse.json({ profile: scrapedProfile });

  } catch (error) {
    console.error("Web Scraping Route Error:", error);
    return NextResponse.json({
      error: error.message || "An unexpected error occurred during scraping."
    }, { status: 500 });
  }
}
