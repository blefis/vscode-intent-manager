# Change Log

All notable changes to the "nokia-intent-manager" extension are documented in this file.

## [0.0.1]

Initial release:
* Connect to a remote Intent Manager.
* Download the full intent type and intent list.
* Create new intent types, clone, create new versions and delete.
* Modify and automatically upload changes in scripts, resources, etc.
* Access to few example snippets.
* Create (copying) intents. Update, save, audit, change network status.
* Retrieve logs from OpenSearch for a particular intent instance (applicable only for log class).
* Access IM with the right pointers to intents and intent types.
* Do all abovementioned actions on a local repository (local folder, git).

## [0.0.2]

Bug fixes:
* Copy and paste view: viewConfig paste to intents views folder.
* Delete and recreate resource with the same name is now allowed (big fixed).

## [0.0.3]

Bug fixes:
* Fixing dependencies in package.json.
* On installation, the Intent Manager folder appears at the bottom of your workspace.
* When closing and reopening the editor, it now tries to reload the content (should not fail).

## [1.0.0]

First shared release.
Bug fixes:
* Look and feel changes for logs.
* Support for view-less intents (old intents prior 23.X, imported in a 23.X system). See DevPortal.

## [1.0.1]

Bug fixes:
* Working with files (resources, modules, intents, views) that contain spaces.

## [1.0.2]

Bug fixes:
* Handling disconnects from NSP.
* Logs to work with 23.11 (OSDversion 2.10.0)