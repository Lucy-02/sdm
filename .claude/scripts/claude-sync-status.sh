#!/bin/bash

# Claude Document Sync Status Checker
# Checks synchronization status of all documents

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}=== Claude Document Sync Status ===${NC}"
echo ""

# Function to check if a file was recently modified
is_recent() {
    local file=$1
    local minutes=${2:-10}  # Default 10 minutes

    if [ ! -f "$file" ]; then
        return 1
    fi

    # Check if file was modified in last N minutes
    if [ $(find "$file" -mmin -$minutes 2>/dev/null | wc -l) -gt 0 ]; then
        return 0
    else
        return 1
    fi
}

# Function to get last modified time
get_modified_time() {
    local file=$1
    if [ -f "$file" ]; then
        date -r "$file" "+%Y-%m-%d %H:%M:%S"
    else
        echo "Not found"
    fi
}

# Check current.md
echo -e "${MAGENTA}=== Current Work Status ===${NC}"
CURRENT_MD=".claude/context/current.md"
if [ -f "$CURRENT_MD" ]; then
    LAST_MODIFIED=$(get_modified_time "$CURRENT_MD")
    echo -e "Last updated: $LAST_MODIFIED"

    if is_recent "$CURRENT_MD" 30; then
        echo -e "${GREEN}✓ Recently updated (within 30 minutes)${NC}"
    else
        echo -e "${YELLOW}⚠ Not recently updated${NC}"
    fi

    # Extract key information
    echo ""
    echo "Active work:"
    grep -A 1 "^## 활성 작업" "$CURRENT_MD" 2>/dev/null | tail -1 || echo "No active work found"
    echo ""
else
    echo -e "${RED}✗ current.md not found!${NC}"
fi

# Check index.md
echo -e "${MAGENTA}=== Numbering Index ===${NC}"
INDEX_MD=".claude/context/index.md"
if [ -f "$INDEX_MD" ]; then
    NEXT_NUM=$(grep "다음 번호:" "$INDEX_MD" 2>/dev/null | sed 's/[^0-9]*//g' || echo "Unknown")
    echo -e "Next number: ${BLUE}$NEXT_NUM${NC}"

    # Count registered documents
    REGISTERED=$(grep -c "^|" "$INDEX_MD" 2>/dev/null || echo 0)
    REGISTERED=$((REGISTERED - 1))  # Subtract header row
    if [ $REGISTERED -lt 0 ]; then REGISTERED=0; fi
    echo -e "Registered documents: $REGISTERED"
else
    echo -e "${YELLOW}⚠ index.md not found${NC}"
fi
echo ""

# Check numbered documents
echo -e "${MAGENTA}=== Numbered Documents ===${NC}"
NUMBERED_DOCS=$(find .claude -name "[0-9][0-9][0-9]_*.md" -type f 2>/dev/null | sort)
NUMBERED_COUNT=$(echo "$NUMBERED_DOCS" | grep -c . 2>/dev/null || echo 0)

if [ "$NUMBERED_COUNT" -gt 0 ]; then
    echo "Found $NUMBERED_COUNT numbered documents:"
    echo "$NUMBERED_DOCS" | while read -r doc; do
        if [ -n "$doc" ]; then
            echo "  - $(basename "$doc")"
        fi
    done
else
    echo "No numbered documents found"
fi
echo ""

# Check for recent modifications
echo -e "${MAGENTA}=== Recent Activity (last 60 minutes) ===${NC}"
RECENT_FILES=$(find .claude -name "*.md" -type f -mmin -60 2>/dev/null | sort)
RECENT_COUNT=$(echo "$RECENT_FILES" | grep -c . 2>/dev/null || echo 0)

if [ $RECENT_COUNT -gt 0 ]; then
    echo "Recently modified files:"
    echo "$RECENT_FILES" | while read -r file; do
        if [ -n "$file" ]; then
            MOD_TIME=$(date -r "$file" "+%H:%M")
            echo -e "  ${GREEN}$MOD_TIME${NC} - $(basename "$file")"
        fi
    done
else
    echo -e "${YELLOW}No recent modifications${NC}"
fi
echo ""

# Check overview files
echo -e "${MAGENTA}=== Overview Files Status ===${NC}"
for dir in plan todo review structure DKB lexicon dev_action; do
    OVERVIEW=".claude/docs/$dir/000_overview.md"
    if [ -f "$OVERVIEW" ]; then
        if is_recent "$OVERVIEW" 1440; then  # 24 hours
            echo -e "${GREEN}✓${NC} docs/$dir/000_overview.md (updated today)"
        else
            MOD_TIME=$(get_modified_time "$OVERVIEW")
            echo -e "${YELLOW}⚠${NC} docs/$dir/000_overview.md (last: $MOD_TIME)"
        fi
    else
        echo -e "${RED}✗${NC} docs/$dir/000_overview.md (missing)"
    fi
done
echo ""

# Check dialog logs
echo -e "${MAGENTA}=== Dialog Logs ===${NC}"
DIALOG_DIR=".claude/context/dialog"
if [ -d "$DIALOG_DIR" ]; then
    DIALOG_COUNT=$(ls -1 "$DIALOG_DIR"/*.md 2>/dev/null | wc -l)
    echo "Total dialog logs: $DIALOG_COUNT"

    # Show latest dialog
    LATEST_DIALOG=$(ls -t "$DIALOG_DIR"/*.md 2>/dev/null | head -1)
    if [ -n "$LATEST_DIALOG" ]; then
        echo "Latest: $(basename "$LATEST_DIALOG")"
    fi
else
    echo -e "${YELLOW}Dialog directory not found${NC}"
fi
echo ""

# Sync recommendations
echo -e "${MAGENTA}=== Sync Recommendations ===${NC}"

NEEDS_SYNC=false

# Check if current.md is stale
if [ -f "$CURRENT_MD" ]; then
    if ! is_recent "$CURRENT_MD" 30; then
        echo -e "${YELLOW}• Update current.md (last update > 30 minutes ago)${NC}"
        NEEDS_SYNC=true
    fi
fi

# Check for unregistered numbered documents
if [ -f "$INDEX_MD" ] && [ "$NUMBERED_COUNT" -gt 0 ]; then
    # Simple check: compare count
    if [ "$NUMBERED_COUNT" -ne "$REGISTERED" ]; then
        echo -e "${YELLOW}• Some numbered documents may not be registered in index.md${NC}"
        NEEDS_SYNC=true
    fi
fi

# Check for stale overviews
for dir in plan todo review structure DKB lexicon dev_action; do
    OVERVIEW=".claude/docs/$dir/000_overview.md"
    if [ -f "$OVERVIEW" ]; then
        if ! is_recent "$OVERVIEW" 1440; then  # 24 hours
            DOCS_IN_DIR=$(find ".claude/docs/$dir" -name "*.md" -not -name "000_overview.md" -not -name "CLAUDE.md" -mtime -1 2>/dev/null | wc -l)
            if [ $DOCS_IN_DIR -gt 0 ]; then
                echo -e "${YELLOW}• Update docs/$dir/000_overview.md (has recent documents)${NC}"
                NEEDS_SYNC=true
            fi
        fi
    fi
done

if [ "$NEEDS_SYNC" = false ]; then
    echo -e "${GREEN}✓ All documents appear to be in sync!${NC}"
fi

echo ""
echo -e "${BLUE}=== Quick Commands ===${NC}"
echo "Update current.md:  nano $CURRENT_MD"
echo "Check links:        ./claude-check-links.sh"
echo "New document:       ./claude-new-doc.sh [type] [name]"