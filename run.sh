#!/bin/bash
# open google-chrome with disabled web-security

echo "Resetting file watcher"
sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl -p --system