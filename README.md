This plugin allows to link entry assets and bundle files.

## Why?

It's side effect of another useful plugin - https://github.com/ol-loginov/parcel-namer-rewrite (it able to
 change bundle names).
 
 After renaming (hashing) you may want to get changed file names. 

## Configuration

Plugin takes all config from package.json file. Example of config is below:

```json5
{
    "name": "...",
    "version": "...",
    "description": "",

  
    "parcel-reporter-entries": {
        "file": "src/main/resources/application-bundle.yml",
        "yml-write": "array",
        "yml-parent": "app/some/parent",
        "yml-array-from": "from",
        "yml-array-to": "to",
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

## Options for output

<table>
<tr><td>yml-write</td><td>"array" or "map"</td><td>When "array" - files are written like objects in array. When "map" - files are written like key-value of some object</td></tr>
<tr><td>yml-parent</td><td>string</td><td>Slash-separated path to element where to put file names map</td></tr>
<tr><td>yml-array-from</td><td>string</td><td> for "array" mode - field for asset file name</td></tr>
<tr><td>yml-array-to</td><td>string</td><td> for "array" mode - field for bundle file name</td></tr>
<tr><td>from-prefix</td><td>string</td><td>Add prefix for asset file name</td></tr>
<tr><td>from-suffix</td><td>string</td><td>Add suffix for asset file name</td></tr>
<tr><td>to-prefix</td><td>string</td><td>Add prefix for bundle file name</td></tr>
<tr><td>to-suffix</td><td>string</td><td>Add suffix for bundle file name</td></tr>
</table>
 