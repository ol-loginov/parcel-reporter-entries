This plugin allows to link entry assets and bundle files.

## Why?

It's side effect of another useful plugin - https://github.com/ol-loginov/parcel-namer-rewrite (it able to
 change bundle names).
 
 After renaming (hashing) you may want to get changed file names. 

## Configuration

Plugin takes all config from package.json file. Example of config is below:

```json
{
    "name": "...",
    "version": "...",
    "description": "",

  
    "parcel-reporter-entries": {
        "file": "src/main/resources/application-bundle.yml",
        "yml-write": "array",
        "yml-parent": "app/some/parent",
        "yml-array-from": "from",
        "yml-array-to": "to"
    }
}
```

This example:
1) write report to 'src/main/resources/application-bundle.yml'.
2) it creates YAML with array of file names and put it under "app" element of YAML. 
    1) "yml-write": "array" | "map". When "array" - files are written like objects in array. When "map" - files are written 
    like key-value of some object
    1) "yml-parent": slash-separated path to element where to put file names map
    2) "yml-array-from": for "array" mode - field for asset file name
    2) "yml-array-to": for "array" mode - field for bundle file name
