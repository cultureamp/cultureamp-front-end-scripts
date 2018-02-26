#!/bin/bash

yarn eslint --fix .

yarn prettier --write "**/*.{css,scss}"
