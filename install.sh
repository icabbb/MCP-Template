#!/bin/bash

# Script to install the project dependencies and set up the environment

# project information
NAME_PROJECT="mcp-example"
PROJECT_DIR="/Volumes/SSD_120GB/mcps/$NAME_PROJECT"

# read properties from package.json
NAME=$(jq -r .name package.json)
VERSION=$(jq -r .version package.json)
DESCRIPTION=$(jq -r .description package.json)

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "🚨 Node.js is not installed. Please install Node.js before continuing."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "🚨 npm is not installed. Please install npm before continuing."
    exit 1
fi

# create the project directory if it doesn't exist 
if [ ! -d "$PROJECT_DIR" ]; then
    echo "✅ Creating $PROJECT_DIR directory"
    mkdir -p "$PROJECT_DIR"
fi

# delete and create the .env file in the project directory
if [ -f "$PROJECT_DIR/.env" ]; then
		echo "❌ Deleting existing .env file in $PROJECT_DIR"
		rm "$PROJECT_DIR/.env"
fi

# create the .env file in the project directory and populate it with the project name, version, and description
echo "NAME=$NAME" >> "$PROJECT_DIR/.env"
echo "VERSION=$VERSION" >> "$PROJECT_DIR/.env"
echo "DESCRIPTION=$DESCRIPTION" >> "$PROJECT_DIR/.env"


#copiar el bundle al path del proyecto
cp -r ./dist/index.js "$PROJECT_DIR"

#crear el package.json quitando los scripts y devDependencies
cat ./package.json | jq 'del(.scripts) | del(.devDependencies)' > "$PROJECT_DIR/package.json"

# install dependencies
if [ -d "$PROJECT_DIR/node_modules" ]; then
		echo "❌ Deleting existing node_modules directory in $PROJECT_DIR"
		rm -rf "$PROJECT_DIR/node_modules"
fi

echo "📦 Installing dependencies in $PROJECT_DIR"
cd "$PROJECT_DIR"
npm install

echo "🚀 Installation complete. Project is set up in $PROJECT_DIR."
echo ""
echo "📚 Getting Started Guide for $NAME_PROJECT"
echo ""
echo "🔖 Run directly with Node.js:"
echo "   node $PROJECT_DIR/index.js"
echo ""
echo "🔖 To use with Claude Desktop, add the following to your claude_desktop_config.json:"
echo "{
  \"mcpServers\": {
    \"$NAME_PROJECT\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"tsx\", \"$PROJECT_DIR/index.js\"]
    }
  }
}"
echo ""
echo "🔖 To use with MCP VScode extension, add the following to your settings.json:"
echo "{
  \"mcp\": {
    \"inputs\": [],
    \"servers\": {
      \"$NAME_PROJECT\": {
        \"command\": \"npx\",
        \"args\": [\"-y\", \"tsx\", \"$PROJECT_DIR/index.js\"],
        \"env\": {}
      }
    }
  }
}"
echo "End of installation script 👋"