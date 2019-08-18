# mail2org-pipeline

First rough attempt at a mail parser. Helper files to parse mbox file and convert links into an orgmode list by topic.

## Usage

mbox2dirty.js mboxfilename emailAddressWithTag fromDateString

fromDateString should be in the format '2019-06-16T00:00:00Z'. Creates accepted.txt and rejected.txt. Format the rejected links properly and add to accepted.txt.

cleanedLinks2org.js accepted.txt

Each link will appear in the console. Type a tag for each link and hit enter. Creates newmiscreading.org.

merge.js originalFileLocation newFileLocation

Creates mergedmiscreading.org. Can replace original org file. 