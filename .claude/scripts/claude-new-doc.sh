#!/bin/bash

# Claude Document Generator Script
# Usage: ./claude-new-doc.sh [type] [name]
# Example: ./claude-new-doc.sh plan "authentication_system"

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Function to get next number from index.md
get_next_number() {
    local index_file=".claude/context/index.md"

    if [ ! -f "$index_file" ]; then
        echo "001"
        return
    fi

    # Extract "다음 번호" line and get the number (with emoji support)
    local next_num=$(grep "다음 번호:" "$index_file" | sed 's/.*다음 번호: *//' | sed 's/[^0-9]*//g')

    if [ -z "$next_num" ]; then
        echo "001"
    else
        printf "%03d" "$next_num"
    fi
}

# Function to update index.md
update_index() {
    local number=$1
    local file_path=$2
    local index_file=".claude/context/index.md"

    # Create index.md if it doesn't exist
    if [ ! -f "$index_file" ]; then
        cat > "$index_file" << EOF
# Global Numbering Index

## 다음 번호: 002

## 등록된 문서

| 번호 | 파일 경로 | 생성일 | 설명 |
|------|-----------|--------|------|
| 001 | $file_path | $DATE | $NAME |
EOF
        echo -e "${GREEN}Created index.md with first entry${NC}"
    else
        # Update next number (handle emoji in pattern)
        local next_num=$((10#$number + 1))
        sed -i "s/\(##.*다음 번호:\).*/\1 $(printf "%03d" $next_num)/" "$index_file"

        # Remove placeholder row if it exists
        sed -i '/| (아직 numbered 문서 없음)/d' "$index_file"

        # Find the table section and add new entry after the header
        # Look for line with "생성 이력" and add after the table header
        awk -v num="$number" -v path="$file_path" -v date="$DATE" -v name="$NAME" '
        {
            print
            if (/^\| 번호.*\| 설명 \|$/) {
                getline
                if ($0 ~ /^\|---/) {
                    print
                    # Check if next line is placeholder
                    getline
                    if ($0 !~ /아직 numbered 문서 없음/) {
                        print
                    }
                    print "| " num " | " path " | " date " | " name " |"
                    printed = 1
                } else {
                    print
                }
            }
        }
        END {
            # If not inserted in table, append at end
            if (!printed) {
                print "| " num " | " path " | " date " | " name " |"
            }
        }
        ' "$index_file" > "${index_file}.tmp" && mv "${index_file}.tmp" "$index_file"

        echo -e "${GREEN}Updated index.md with entry $number${NC}"
    fi
}

# Get next number
NUMBER=$(get_next_number)
echo -e "${BLUE}Assigned number: $NUMBER${NC}"

# Determine file path and template based on type
case $TYPE in
    plan)
        DIR=".claude/docs/plan"
        FILENAME="${NUMBER}_${NAME}_plan.md"
        TEMPLATE=".claude/templates/plan_template.md"
        ;;
    todo)
        DIR=".claude/docs/todo"
        FILENAME="${NUMBER}_${NAME}_todo.md"
        TEMPLATE=".claude/templates/todo_template.md"
        ;;
    review)
        DIR=".claude/docs/review"
        FILENAME="${NUMBER}_${NAME}_review.md"
        TEMPLATE=".claude/templates/review_template.md"
        ;;
    structure)
        DIR=".claude/docs/structure"
        FILENAME="${NUMBER}_${NAME}.md"
        TEMPLATE=".claude/templates/structure_template.md"
        ;;
    dkb)
        DIR=".claude/docs/DKB"
        FILENAME="${NUMBER}_${NAME}_knowledge.md"
        TEMPLATE=".claude/templates/dkb_template.md"
        ;;
    lexicon)
        DIR=".claude/docs/lexicon"
        FILENAME="${NUMBER}_${NAME}_terms.md"
        TEMPLATE=".claude/templates/lexicon_template.md"
        ;;
    dev_action)
        DIR=".claude/docs/dev_action"
        FILENAME="${NUMBER}_${NAME}_action.md"
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
    sed -i "s/\[번호\]/$NUMBER/g" "$FILEPATH"
    sed -i "s/\[작업명\]/$NAME/g" "$FILEPATH"
    sed -i "s/\[작업 이름\]/$NAME/g" "$FILEPATH"
    sed -i "s/YYYY-MM-DD/$DATE/g" "$FILEPATH"
    echo -e "${GREEN}Created $FILEPATH from template${NC}"
else
    echo "# ${NUMBER}_${NAME}" > "$FILEPATH"
    echo "" >> "$FILEPATH"
    echo "Created: $DATE" >> "$FILEPATH"
    echo -e "${YELLOW}No template found, created basic file${NC}"
fi

# Update index.md
update_index "$NUMBER" "$FILEPATH"

# Update overview if it exists
OVERVIEW="$DIR/000_overview.md"
if [ -f "$OVERVIEW" ]; then
    echo -e "${BLUE}Remember to update $OVERVIEW${NC}"
fi

# Update current.md reminder
echo -e "${YELLOW}Don't forget to update .claude/context/current.md${NC}"

echo -e "${GREEN}✓ Document created successfully: $FILEPATH${NC}"
echo -e "${GREEN}✓ Number $NUMBER registered in index.md${NC}"

# Open in editor if EDITOR is set
if [ -n "$EDITOR" ]; then
    $EDITOR "$FILEPATH"
fi