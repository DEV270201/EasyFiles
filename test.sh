#!/bin/bash

echo -e "\nTesting CloudFront..."
for i in {1..6}; do
    echo "Test $i:"
    curl -w "TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null -s "https://d1lx1rw7ugnzp3.cloudfront.net/files/40MB-TESTFILE.ORG-1753992061852.pdf"
done
