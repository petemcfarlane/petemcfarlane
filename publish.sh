#!/bin/bash

if [ -z "$1" ]; then echo "You forgot a commit message"; exit 1; fi


# # Replace "sculpin generate" with "php sculpin.phar generate" if sculpin.phar
# # was downloaded and placed in this directory instead of sculpin having been
# # installed globally.

sculpin generate --env=prod
if [ $? -ne 0 ]; then echo "Could not generate the site"; exit 1; fi

# # Add --delete right before "output_prod" to have rsync remove files that are
# # deleted locally from the destination too. See README.md for an example.
# # rsync -avze 'ssh -p 4668' output_prod/ username@yoursculpinsite:public_html
# # if [ $? -ne 0 ]; then echo "Could not publish the site"; exit 1; fi

cp -R output_prod ../petemcfarlane-public

git commit -am "$1"

git remote add origin git@github.com:petemcfarlane/petemcfarlane-public.git

git push -u origin master