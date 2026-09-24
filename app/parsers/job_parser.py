from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

TIMEOUT_SECONDS = 15

ALTERNATIVES = "the company's own career page or a job board like StepStone, Indeed or Xing"

LINKEDIN_MESSAGE = (
    "LinkedIn didn't let us read this posting. "
    f"Find the same job on {ALTERNATIVES} and paste that link instead."
)


class JobPageError(Exception):
    """The job URL couldn't be read. The message is written to be shown to users."""


def _is_linkedin(url):
    host = urlparse(url).hostname or ""
    return host == "linkedin.com" or host.endswith(".linkedin.com")


def parse_job_url(url):
    linkedin = _is_linkedin(url)

    try:
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT_SECONDS)
    except requests.RequestException as e:
        raise JobPageError(
            "We couldn't open that job page. "
            f"Check the link works in your browser, or paste a link from {ALTERNATIVES}."
        ) from e

    if response.status_code != 200:
        # LinkedIn answers blocked requests with its own 999 status
        if linkedin:
            raise JobPageError(LINKEDIN_MESSAGE)
        raise JobPageError(
            f"That job page didn't load for us (error {response.status_code}). "
            f"Try a link from {ALTERNATIVES}."
        )

    soup = BeautifulSoup(response.text, "lxml")

    # ---- LinkedIn specific attempt ----
    linkedin_desc = soup.find("div", {"class": "description__text"})
    if linkedin_desc:
        return linkedin_desc.get_text(separator="\n").strip()

    # A LinkedIn page without the description is a login wall, not a job posting
    if linkedin:
        raise JobPageError(LINKEDIN_MESSAGE)

    # ---- Generic fallback ----
    paragraphs = soup.find_all("p")
    text = "\n".join([p.get_text() for p in paragraphs])

    if not text.strip():
        raise JobPageError(
            "We couldn't find a job description on that page. "
            f"Try a link from {ALTERNATIVES}."
        )

    return text.strip()
