# CryProj README

[![Current Version](https://vsmarketplacebadge.apphb.com/version/l0ll098.cryproj.svg)](https://marketplace.visualstudio.com/items?itemName=l0ll098.cryproj)
[![Install Count](https://vsmarketplacebadge.apphb.com/installs/l0ll098.cryproj.svg)](https://marketplace.visualstudio.com/items?itemName=l0ll098.cryproj)
[![Open Issues](https://vsmarketplacebadge.apphb.com/rating/l0ll098.cryproj.svg) ](https://marketplace.visualstudio.com/items?itemName=l0ll098.cryproj)

A simple extension for Visual Studio Code that adds support for .cryproj files.

*Note: This is an unofficial project and it's not affiliated with Crytek and/or [CRYENGINE](https://github.com/CRYTEK/CRYENGINE).*

## Features
This extension will add to your editor the following features:

 - [Code theming](#Code-theming)
 - [Suggestions](#Suggestions)
 - [A list of console variables and commands](#A-list-of-console-variables-and-commands)



### Code theming

![Code theming](images/CodeTheming.PNG)

### Suggestions

![Code suggestions](images/CodeSuggestions.PNG)

### A list of console variables and commands
![Code theming](images/CommandsSuggestions.PNG)

 

## Requirements

This extension will work with Visual Studio Code 0.10.0 and later.


## Known Issues

None. If you find one, plase [open a Issue](https://github.com/l0ll098/CryProj/issues/new).

## Release Notes

For a full list of changes check the [CHANGELOG.md](./CHANGELOG.md) file.

## 1.2.0-preview
- Added support for [CRYENGINE 5.5 preview 1](https://github.com/CRYTEK/CRYENGINE/releases/tag/5.5.0_preview1)
- Showing CryProj files as a JSON one (Bottom-right corner)
- Added a quick pick menu (Bottom left corner) to easly change engine version
- Suggestions are given based on the engine version (*Note: This will prompt you to reload VS Code*)
- Fixed an issue that prevented reading the engine version from a file when it didn't contained valid JSON 

### 1.1.5
 - Banners

### 1.1.1 - 1.1.4
 - Fixes images not shown in the readme.md

### 1.1.0
 - Changes in the Readme.md

### 1.0.0
 - First released version
