#!/bin/bash
set -euo pipefail

# Function to display script usage
function display_usage() {
  echo "Usage: $0 <directory> [options]"
  echo ""
  echo "Options:"
  echo "  <directory>    Directory to search for files"
  echo "  --github       Print 'github'"
  echo "  --help         Display this help message"
  exit 1
}

# Parse command line arguments
if [[ $# -eq 0 ]]; then
  display_usage
fi

DIRECTORY=""
GITHUB_FLAG=false

# Iterate through the command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --github)
      GITHUB_FLAG=true
      ;;
    --help)
      display_usage
      ;;
    *)
      DIRECTORY=$1
      ;;
  esac
  shift
done

# Verify if a directory is specified
if [[ -z "$DIRECTORY" ]]; then
  echo "Error: Directory is not specified."
  exit 1
fi

# Verify if the directory exists
if [[ ! -d "$DIRECTORY" ]]; then
  echo "Error: Directory '$DIRECTORY' does not exist."
  exit 1
fi

# Change to the specified directory
cd "$DIRECTORY" || exit

trim_empty_lines() { sed -e '/./,$!d' -e :a -e '/^\n*$/{$d;N;ba' -e '}'; }
indent() { sed 's/^/  /'; }

NOW="$(date +%s)"
function last_modified_date() {
    file="$1"
    if [ -f "$file" ]; then
        modified=$(stat -c %Y "$file")
        diff=$((NOW - modified))

        if [ $diff -lt 86400 ]; then
            if [ $diff -lt 60 ]; then
                echo "$diff seconds ago"
            elif [ $diff -lt 3600 ]; then
                minutes=$((diff / 60))
                seconds=$((diff % 60))
                echo "${minutes}m${seconds}s ago"
            else
                hours=$((diff / 3600))
                minutes=$(((diff % 3600) / 60))
                echo "${hours}h${minutes}m ago"
            fi
        else
            date -r "$file" +"%Y-%m-%d %H:%M"
        fi
    else
        echo "File not found!"
    fi
}

find . -type f -print0 \
  | xargs -0 stat -c "%Y %n" \
  | sort \
  | cut -f 2- -d ' ' \
  | while read FILE
do
  if [[ "$GITHUB_FLAG" = true ]]; then
    echo "::group::$(tput bold)$FILE$(tput sgr0) $(last_modified_date "$FILE")"
    cat "$FILE" | trim_empty_lines
    echo "::endgroup::"
  else
    echo "$(tput setaf 6)$FILE$(tput sgr0) $(last_modified_date "$FILE")"
    cat "$FILE" | trim_empty_lines | indent
    echo
  fi
done
