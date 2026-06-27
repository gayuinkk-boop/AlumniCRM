import os
import sys
import json
import argparse

# Add local venv site-packages to path to ensure dependencies are loaded
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "venv", "lib", "python3.9", "site-packages"))

import nest_asyncio
# Apply nest_asyncio to allow nested event loops which ScrapeGraphAI/Playwright might require
nest_asyncio.apply()

from pydantic import BaseModel, Field
from typing import List, Optional
from scrapegraphai.graphs import SmartScraperGraph

# Define structured schemas for extraction
class ExperienceItem(BaseModel):
    title: str = Field(default="", description="The job title")
    company: str = Field(default="", description="The company or employer name")
    duration: str = Field(default="", description="The duration, e.g., 'Jan 2020 - Present'")
    description: str = Field(default="", description="A short description of duties or responsibilities")

class EducationItem(BaseModel):
    school: str = Field(default="", description="The school, college, or university name")
    degree: str = Field(default="", description="The degree name, e.g., 'Bachelor of Engineering'")
    stream: str = Field(default="", description="The major, branch, or field of study, e.g., 'Computer Science'")
    duration: str = Field(default="", description="The graduation or duration years, e.g., '2018 - 2022'")

class ProfileSchema(BaseModel):
    full_name: str = Field(default="", description="The person's full name")
    headline: str = Field(default="", description="A professional headline, e.g., 'Software Engineer @ Google'")
    industry: str = Field(default="Tech", description="The industry category, e.g., 'Tech', 'Finance', 'Education'")
    bio: str = Field(default="", description="A summary bio, description, or about section of the person")
    skills: List[str] = Field(default_factory=list, description="A list of professional skills or keywords")
    current_company: str = Field(default="", description="Current employer company name")
    current_role: str = Field(default="", description="Current job title or role name")
    stream: str = Field(default="", description="Major branch of study from their most recent education")
    graduation_year: str = Field(default="", description="Graduation year from their most recent education")
    experience: List[ExperienceItem] = Field(default_factory=list, description="List of professional work experiences")
    education: List[EducationItem] = Field(default_factory=list, description="List of academic educations")

def main():
    parser = argparse.ArgumentParser(description="Scrape web profiles using ScrapeGraphAI and Gemini")
    parser.add_argument("url", type=str, help="The URL of the webpage to scrape")
    parser.add_argument("--prompt", type=str, default="Extract all professional, career, education, and skills details of the person.", help="Custom instructions for extraction")
    args = parser.parse_args()

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print(json.dumps({"error": "GEMINI_API_KEY environment variable is not set."}))
        sys.exit(1)

    graph_config = {
        "llm": {
            "api_key": api_key,
            "model": "google_genai/gemini-2.5-flash",  # Using the newer gemini-2.5-flash model via google_genai provider
        },
        "verbose": False,
        "headless": True,
    }

    # If it is a local file, read its contents and pass as raw HTML/text
    source_content = args.url
    if os.path.exists(args.url):
        try:
            with open(args.url, "r", encoding="utf-8") as f:
                source_content = f.read()
        except Exception as e:
            print(json.dumps({"error": f"Failed to read local file: {str(e)}"}))
            sys.exit(1)

    try:
        # Run SmartScraperGraph with our pydantic schema for guaranteed structured output
        smart_scraper_graph = SmartScraperGraph(
            prompt=args.prompt,
            source=source_content,
            config=graph_config,
            schema=ProfileSchema
        )

        result = smart_scraper_graph.run()

        # Output the parsed result to stdout as JSON
        if isinstance(result, dict):
            print(json.dumps(result, indent=2))
        else:
            # If it's a Pydantic model directly
            try:
                print(result.model_dump_json(indent=2))
            except AttributeError:
                print(json.dumps(result, indent=2))

    except Exception as e:
        print(json.dumps({"error": f"Scraping failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
