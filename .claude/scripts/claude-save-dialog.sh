#!/bin/bash

# Claude Dialog Saver Script
# Saves current conversation to dialog directory
# Usage: ./claude-save-dialog.sh [optional_description]

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Dialog directory
DIALOG_DIR=".claude/context/dialog"
DATE=$(date +%Y%m%d)
TIME=$(date +%H:%M:%S)

# Create dialog directory if it doesn't exist
mkdir -p "$DIALOG_DIR"

# Find next dialog number for today
get_next_dialog_number() {
    local existing=$(ls "$DIALOG_DIR"/${DATE}_*.md 2>/dev/null | wc -l)
    printf "%03d" $((existing + 1))
}

# Get dialog number
NUMBER=$(get_next_dialog_number)
FILENAME="${DATE}_${NUMBER}_dialog.md"
FILEPATH="$DIALOG_DIR/$FILENAME"

# Optional description from argument
DESCRIPTION="${1:-작업 대화}"

# Create dialog header
cat > "$FILEPATH" << EOF
# Dialog Log - $DATE #$NUMBER

## 세션 정보
- 날짜: $(date +%Y-%m-%d)
- 시간: $TIME
- 설명: $DESCRIPTION

## 대화 내용

### User
[이전 대화 내용을 여기에 붙여넣으세요]

### Claude
[응답 내용]

---

## 주요 결정사항
- [대화에서 결정된 중요 사항]

## 다음 작업
- [후속 작업 계획]

## 관련 문서
- current.md 참조
- 생성된 문서: [numbered 문서들]
EOF

echo -e "${GREEN}✓ Dialog file created: $FILEPATH${NC}"
echo -e "${YELLOW}Please manually copy the conversation content to the file.${NC}"

# Update current.md to reference this dialog
CURRENT_MD=".claude/context/current.md"
if [ -f "$CURRENT_MD" ]; then
    echo -e "${BLUE}Remember to update current.md with this dialog reference.${NC}"
fi

# Open in editor if available
if [ -n "$EDITOR" ]; then
    $EDITOR "$FILEPATH"
else
    echo -e "${YELLOW}Tip: Set EDITOR environment variable to automatically open the file${NC}"
fi

echo -e "${GREEN}Dialog saved as: $FILENAME${NC}"