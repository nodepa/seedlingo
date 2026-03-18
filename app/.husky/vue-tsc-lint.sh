#!/bin/bash -e

pwd
TMP=tsconfig.pre-commit.json
cat >$TMP <<EOF
{
  "extends": "./tsconfig.json",
  "include": [
EOF
for file in "$@"; do
  # Only include files within tsconfig.json's scope (src/ and tests/).
  # Root config files (e.g. vite.config.ts) belong to tsconfig.node.json
  # and are not checked here to avoid moduleResolution mismatches.
  if [[ "$file" == src/* ]] || [[ "$file" == tests/* ]]; then
    echo "    \"$file\"," >> $TMP
  fi
done
cat >>$TMP <<EOF
    "**/*.d.ts"
  ]
}
EOF
npx vue-tsc --project $TMP --skipLibCheck --noEmit
