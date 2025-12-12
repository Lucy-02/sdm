#!/bin/bash

# Claude Document Generator Script (브랜치 기반 넘버링)
# Usage: ./claude-new-doc.sh [type] [name]
# Example: ./claude-new-doc.sh plan "authentication_system"

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: $0 [type] [name]"
    echo "Types: plan, todo, review, structure, dkb, lexicon, dev_action"
    echo "Example: $0 plan authentication_system"
    exit 1
fi

TYPE=$1
NAME=$2
DATE=$(date +%Y-%m-%d)
INDEX_FILE=".claude/context/index.md"

# Function to get current git branch and normalize it
get_branch_name() {
    local branch=$(git branch --show-current 2>/dev/null)
    if [ -z "$branch" ]; then
        echo "main"
        return
    fi
    # Normalize: replace / with -, convert to lowercase
    echo "$branch" | tr '/' '-' | tr '[:upper:]' '[:lower:]'
}

# Function to ensure branch section exists in index.md
ensure_branch_section() {
    local branch=$1

    # Check if branch section already exists
    if grep -q "^### \[$branch\]" "$INDEX_FILE"; then
        return 0
    fi

    # Add new branch section before "---" separator (after 브랜치별 번호 현황)
    awk -v branch="$branch" '
    /^## 🌿 브랜치별 번호 현황/ {
        print
        getline
        print
        # Print new branch section
        print ""
        print "### [" branch "]"
        print "다음 번호: 001"
        print ""
        print "| 번호 | 파일명 | 위치 | 생성일시 | 설명 |"
        print "|------|--------|------|----------|------|"
        print "| (아직 문서 없음) | | | | |"
        print ""
        next
    }
    { print }
    ' "$INDEX_FILE" > "${INDEX_FILE}.tmp" && mv "${INDEX_FILE}.tmp" "$INDEX_FILE"

    echo -e "${CYAN}Created new branch section for [$branch]${NC}"
}

# Function to get next number for specific branch
get_next_number() {
    local branch=$1

    if [ ! -f "$INDEX_FILE" ]; then
        echo "001"
        return
    fi

    # Find branch section and extract next number
    local in_section=0
    local next_num=""

    while IFS= read -r line; do
        if [[ "$line" =~ ^###\ \[$branch\] ]]; then
            in_section=1
            continue
        fi
        if [ $in_section -eq 1 ]; then
            if [[ "$line" =~ ^다음\ 번호:\ *([0-9]+) ]]; then
                next_num="${BASH_REMATCH[1]}"
                break
            fi
            # If we hit another section header, stop
            if [[ "$line" =~ ^### ]]; then
                break
            fi
        fi
    done < "$INDEX_FILE"

    if [ -z "$next_num" ]; then
        echo "001"
    else
        printf "%03d" "$next_num"
    fi
}

# Function to update index.md for specific branch
update_index() {
    local branch=$1
    local number=$2
    local file_path=$3
    local name=$4

    # Calculate next number
    local next_num=$((10#$number + 1))
    local next_num_str=$(printf "%03d" $next_num)

    # Create temp file with updates
    awk -v branch="$branch" -v num="$number" -v path="$file_path" -v thedate="$DATE" -v thename="$name" -v nextnum="$next_num_str" '
    BEGIN { in_section = 0 }

    # Detect branch section start
    /^### \[/ {
        if (index($0, "[" branch "]") > 0) {
            in_section = 1
        } else {
            in_section = 0
        }
        print
        next
    }

    # Update "다음 번호" in current branch section
    in_section == 1 && /^다음 번호:/ {
        print "다음 번호: " nextnum
        next
    }

    # Add entry after table header separator in current branch section
    in_section == 1 && /^\|------/ {
        print
        getline nextline
        # Skip placeholder row if exists
        if (nextline ~ /아직 문서 없음/) {
            # Replace placeholder with actual entry
            print "| " num " | " thename " | " path " | " thedate " | " thename " |"
        } else {
            # Add new entry before existing entries
            print "| " num " | " thename " | " path " | " thedate " | " thename " |"
            print nextline
        }
        next
    }

    # Reset section flag on separator or new main section
    /^---$/ || /^## [^#]/ {
        in_section = 0
    }

    { print }
    ' "$INDEX_FILE" > "${INDEX_FILE}.tmp" && mv "${INDEX_FILE}.tmp" "$INDEX_FILE"

    echo -e "${GREEN}Updated index.md: [$branch] #$number${NC}"
}

# Get current branch
BRANCH=$(get_branch_name)
echo -e "${CYAN}Current branch: $BRANCH${NC}"

# Ensure index.md exists
if [ ! -f "$INDEX_FILE" ]; then
    echo -e "${RED}Error: $INDEX_FILE not found${NC}"
    echo "Please ensure .claude/context/index.md exists"
    exit 1
fi

# Ensure branch section exists
ensure_branch_section "$BRANCH"

# Get next number for this branch
NUMBER=$(get_next_number "$BRANCH")
echo -e "${BLUE}Assigned number: ${BRANCH}_${NUMBER}${NC}"

# Determine file path and template based on type
case $TYPE in
    plan)
        DIR=".claude/docs/plan"
        FILENAME="${BRANCH}_${NUMBER}_${NAME}_plan.md"
        TEMPLATE=".claude/templates/plan_template.md"
        ;;
    todo)
        DIR=".claude/docs/todo"
        FILENAME="${BRANCH}_${NUMBER}_${NAME}_todo.md"
        TEMPLATE=".claude/templates/todo_template.md"
        ;;
    review)
        DIR=".claude/docs/review"
        FILENAME="${BRANCH}_${NUMBER}_${NAME}_review.md"
        TEMPLATE=".claude/templates/review_template.md"
        ;;
    structure)
        DIR=".claude/docs/structure"
        FILENAME="${BRANCH}_${NUMBER}_${NAME}.md"
        TEMPLATE=".claude/templates/structure_template.md"
        ;;
    dkb)
        DIR=".claude/docs/DKB"
        FILENAME="${BRANCH}_${NUMBER}_${NAME}_knowledge.md"
        TEMPLATE=".claude/templates/dkb_template.md"
        ;;
    lexicon)
        DIR=".claude/docs/lexicon"
        FILENAME="${BRANCH}_${NUMBER}_${NAME}_terms.md"
        TEMPLATE=".claude/templates/lexicon_template.md"
        ;;
    dev_action)
        DIR=".claude/docs/dev_action"
        FILENAME="${BRANCH}_${NUMBER}_${NAME}_action.md"
        TEMPLATE=".claude/templates/dev_action_template.md"
        ;;
    *)
        echo -e "${RED}Error: Unknown type '$TYPE'${NC}"
        echo "Valid types: plan, todo, review, structure, dkb, lexicon, dev_action"
        exit 1
        ;;
esac

# Create directory if it doesn't exist
mkdir -p "$DIR"

# Full file path
FILEPATH="$DIR/$FILENAME"

# Check if file already exists
if [ -f "$FILEPATH" ]; then
    echo -e "${YELLOW}Warning: File already exists: $FILEPATH${NC}"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Copy template or create empty file
if [ -f "$TEMPLATE" ]; then
    cp "$TEMPLATE" "$FILEPATH"
    # Replace placeholders
    sed -i "s/\[번호\]/${BRANCH}_${NUMBER}/g" "$FILEPATH"
    sed -i "s/\[작업명\]/$NAME/g" "$FILEPATH"
    sed -i "s/\[작업 이름\]/$NAME/g" "$FILEPATH"
    sed -i "s/YYYY-MM-DD/$DATE/g" "$FILEPATH"
    echo -e "${GREEN}Created $FILEPATH from template${NC}"
else
    echo "# ${BRANCH}_${NUMBER}_${NAME}" > "$FILEPATH"
    echo "" >> "$FILEPATH"
    echo "Created: $DATE" >> "$FILEPATH"
    echo "Branch: $BRANCH" >> "$FILEPATH"
    echo -e "${YELLOW}No template found, created basic file${NC}"
fi

# Update index.md
update_index "$BRANCH" "$NUMBER" "$FILEPATH" "$NAME"

# Update current.md reminder
echo -e "${YELLOW}Don't forget to update .claude/context/current.md${NC}"

echo ""
echo -e "${GREEN}✓ Document created successfully!${NC}"
echo -e "  File: ${CYAN}$FILEPATH${NC}"
echo -e "  Branch: ${CYAN}$BRANCH${NC}"
echo -e "  Number: ${CYAN}$NUMBER${NC}"

# Open in editor if EDITOR is set
if [ -n "$EDITOR" ]; then
    $EDITOR "$FILEPATH"
fi
