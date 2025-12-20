#!/bin/bash

cd /var/www/html/pluto_says_f/targets || exit 1

# Count how many .jpeg files you have
total_files=$(ls -1 *.jpeg 2>/dev/null | wc -l)

if [ "$total_files" -eq 0 ]; then
  echo "No .jpeg files found."
  exit 1
fi

echo "[" > image_list.json
for ((i=1; i<=total_files; i++)); do
  if [ $i -lt $total_files ]; then
    echo "  \"${i}.jpeg\"," >> image_list.json
  else
    echo "  \"${i}.jpeg\"" >> image_list.json
  fi
done
echo "]" >> image_list.json

echo "JSON file image_list.json created with $total_files entries."
