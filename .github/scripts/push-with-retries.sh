#!/usr/bin/env bash
set -euo pipefail

BRANCH="$1"
MAX_RETRIES=${2:-5}
SLEEP_BASE=${3:-3}
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
  echo "Attempt $(($COUNT + 1)) to push branch $BRANCH"
  if git push -u origin "$BRANCH" --no-verify; then
    echo "Push successful"
    exit 0
  fi

  CODE=$?
  echo "Push failed with code $CODE. Sleeping..."
  sleep $((SLEEP_BASE * (2 ** COUNT)))
  COUNT=$((COUNT + 1))
done

echo "Failed to push after $MAX_RETRIES attempts"
exit 1
