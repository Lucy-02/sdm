#!/bin/bash

# Claude Document Link Checker
# Checks for broken links in all markdown files

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Claude Document Link Checker ===${NC}"
echo ""

# Counters
TOTAL_LINKS=0
BROKEN_LINKS=0
CHECKED_FILES=0

# Find all markdown files in .claude directory
echo -e "${BLUE}Scanning .claude directory for markdown files...${NC}"

# Function to check if file/directory exists
check_link() {
    local link=$1
    local source_file=$2
    local source_dir=$(dirname "$source_file")

    # Skip external links
    if [[ $link == http* ]]; then
        return 0
    fi

    # Skip anchors
    if [[ $link == "#"* ]]; then
        return 0
    fi

    # Remove anchor from link if present
    link=$(echo "$link" | cut -d'#' -f1)

    # Handle relative paths
    if [[ $link == .claude/* ]]; then
        # Path from project root
        target="$link"
    elif [[ $link == /* ]]; then
        # Absolute path (treat as from project root)
        target="${link:1}"
    else
        # Relative to current file
        target="$source_dir/$link"
    fi

    # Normalize path (remove ./ and ../)
    target=$(realpath --relative-to=. "$target" 2>/dev/null || echo "$target")

    # Check if target exists
    if [ ! -e "$target" ]; then
        return 1
    fi

    return 0
}

# Process each markdown file
while IFS= read -r file; do
    CHECKED_FILES=$((CHECKED_FILES + 1))
    echo -e "${YELLOW}Checking: $file${NC}"

    # Extract all markdown links [text](link)
    while IFS= read -r line; do
        # Extract link from [text](link) format
        if [[ $line =~ \[([^\]]*)\]\(([^\)]+)\) ]]; then
            link="${BASH_REMATCH[2]}"
            text="${BASH_REMATCH[1]}"
            TOTAL_LINKS=$((TOTAL_LINKS + 1))

            if ! check_link "$link" "$file"; then
                echo -e "${RED}  ✗ Broken link: [$text]($link)${NC}"
                BROKEN_LINKS=$((BROKEN_LINKS + 1))
            fi
        fi
    done < "$file"
done < <(find .claude -name "*.md" -type f)

# Also check root CLAUDE.md and README.md
for file in CLAUDE.md README.md; do
    if [ -f "$file" ]; then
        CHECKED_FILES=$((CHECKED_FILES + 1))
        echo -e "${YELLOW}Checking: $file${NC}"

        while IFS= read -r line; do
            if [[ $line =~ \[([^\]]*)\]\(([^\)]+)\) ]]; then
                link="${BASH_REMATCH[2]}"
                text="${BASH_REMATCH[1]}"
                TOTAL_LINKS=$((TOTAL_LINKS + 1))

                if ! check_link "$link" "$file"; then
                    echo -e "${RED}  ✗ Broken link: [$text]($link)${NC}"
                    BROKEN_LINKS=$((BROKEN_LINKS + 1))
                fi
            fi
        done < "$file"
    fi
done

echo ""
echo -e "${BLUE}=== Summary ===${NC}"
echo -e "Files checked: ${CHECKED_FILES}"
echo -e "Total links: ${TOTAL_LINKS}"

if [ $BROKEN_LINKS -eq 0 ]; then
    echo -e "${GREEN}✓ All links are valid!${NC}"
    exit 0
else
    echo -e "${RED}✗ Found ${BROKEN_LINKS} broken links${NC}"
    exit 1
fi