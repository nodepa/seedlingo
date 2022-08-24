#!/bin/bash -e

pwd
TMP=.tsconfig.lint.json
cat >$TMP <<EOF
{
  "extends": "./tsconfig.json",
  "include": [
EOF
for file in "$@"; do
  echo "    \"$file\"," >> $TMP
done
cat >>$TMP <<EOF
    "**/*.d.ts"
  ]
}
EOF
npx vue-tsc --project $TMP --skipLibCheck --noEmit
