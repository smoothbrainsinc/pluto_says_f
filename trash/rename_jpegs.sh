#!/bin/bash

cd /var/www/html/pluto_says_f/targets || exit 1

counter=1

# Loop over all .jpeg files sorted alphabetically
for file in *.jpeg; do
    newname="${counter}.jpeg"

    # Check if newname exists (to prevent overwrite)
    if [[ -e "$newname" ]]; then
        echo "Warning: $newname already exists, skipping $file"
    else
        echo "Renaming $file to $newname"
        mv -i -- "$file" "$newname"
        ((counter++))
    fi
done

echo "Renaming completed. Total files renamed: $((counter - 1))"
