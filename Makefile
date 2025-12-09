# 기본 타겟: make만 실행하면 help 표시
.DEFAULT_GOAL := help

.PHONY: help mcp-add mcp-add-context7 mcp-add-sequential mcp-add-serena mcp-add-time mcp-remove mcp-list mcp-reset mcp-check

# 도움말
help:
	@echo "🚀 Claude Code MCP Management"
	@echo ""
	@echo "Available commands:"
	@echo "  make mcp-add               - 모든 MCP 서버 추가"
	@echo "  make mcp-add-context7      - Context7만 추가"
	@echo "  make mcp-add-sequential    - Sequential Thinking만 추가"
	@echo "  make mcp-add-serena        - Serena만 추가"
	@echo "  make mcp-add-time          - Time만 추가"
	@echo "  make mcp-list              - MCP 서버 목록 확인"
	@echo "  make mcp-check             - .mcp.json 파일 확인"
	@echo "  make mcp-remove            - 모든 MCP 서버 제거"
	@echo "  make mcp-remove-context7   - Context7만 제거"
	@echo "  make mcp-remove-sequential - Sequential Thinking만 제거"
	@echo "  make mcp-remove-serena     - Serena만 제거"
	@echo "  make mcp-remove-time       - Time만 제거"
	@echo "  make mcp-reset             - 프로젝트 승인 초기화"
	@echo ""
	@echo "📖 Quick Start:"
	@echo "  1. make mcp-add     # MCP 서버 추가"
	@echo "  2. make mcp-check   # .mcp.json 확인"
	@echo "  3. make mcp-list    # 서버 목록 확인"

# 모든 MCP 서버 추가
mcp-add: mcp-add-context7 mcp-add-sequential mcp-add-serena mcp-add-time
	@echo ""
	@echo "✅ All MCP servers have been added!"
	@echo "Run 'make mcp-list' to verify"

# Context7 추가 (HTTP transport)
mcp-add-context7:
	@echo "📦 Adding Context7 MCP server..."
	@claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: ctx7sk-606ac67e-d496-461d-90f7-7d9f61bbd916"
	@echo "✓ Context7 added"

# Sequential Thinking 추가 (npx)
mcp-add-sequential:
	@echo "📦 Adding Sequential Thinking MCP server..."
	@claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
	@echo "✓ Sequential Thinking added"

# Serena 추가 (uvx)
mcp-add-serena:
	@echo "📦 Adding Serena MCP server..."
	@claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project $(PWD)
	@echo "✓ Serena added"

# Time 추가 (uvx)
mcp-add-time:
	@echo "📦 Adding Time MCP server..."
	@claude mcp add time -- uvx mcp-server-time
	@echo "✓ Time added"

# MCP 서버 목록 확인
mcp-list:
	@echo "📋 Current MCP servers:"
	@claude mcp list

# 특정 MCP 서버 제거
mcp-remove-context7:
	@echo "🗑️  Removing Context7..."
	@claude mcp remove context7
	@echo "✓ Context7 removed"

mcp-remove-sequential:
	@echo "🗑️  Removing Sequential Thinking..."
	@claude mcp remove sequential-thinking
	@echo "✓ Sequential Thinking removed"

mcp-remove-serena:
	@echo "🗑️  Removing Serena..."
	@claude mcp remove serena
	@echo "✓ Serena removed"

mcp-remove-time:
	@echo "🗑️  Removing Time..."
	@claude mcp remove time
	@echo "✓ Time removed"

# 모든 MCP 서버 제거
mcp-remove: mcp-remove-context7 mcp-remove-sequential mcp-remove-serena mcp-remove-time
	@echo ""
	@echo "✅ All MCP servers have been removed!"

# 프로젝트 승인 초기화
mcp-reset:
	@echo "🔄 Resetting project approvals..."
	@claude mcp reset-project-choices
	@echo "✓ Project approvals reset"

# .mcp.json 파일 확인
mcp-check:
	@echo "📄 Checking .mcp.json file..."
	@if [ -f .mcp.json ]; then \
		echo "✓ .mcp.json exists"; \
		echo ""; \
		cat .mcp.json | python3 -m json.tool; \
	else \
		echo "✗ .mcp.json not found"; \
		echo "Run 'make mcp-add' first"; \
	fi
