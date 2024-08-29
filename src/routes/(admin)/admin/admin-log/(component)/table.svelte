<script lang="ts">
    // @ts-nocheck
    export let jsonString = '';

    let jsonObject;

    // Parse JSON string and handle errors
    function parseJSON(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Invalid JSON string:", e);
            return null;
        }
    }

    // Create HTML from JSON object
    function createHTMLFromJSON(jsonObj) {
        if (jsonObj === null) {
            return '<span class="json-null">null</span>';
        }

        if (typeof jsonObj === 'object') {
            if (Array.isArray(jsonObj)) {
                return `<span class="json-bracket">[</span><div class="indent">${jsonObj.map((item, index) => createHTMLFromJSON(item) + (index < jsonObj.length - 1 ? ',' : '')).join('')}</div><span class="json-bracket">]</span>`;
            } else {
                const keys = Object.keys(jsonObj);
                return `<span class="json-bracket">{</span><div class="indent">${keys.map((key, index) => `<span class="json-key">"${key}"</span>: ${createHTMLFromJSON(jsonObj[key])}${index < keys.length - 1 ? ',' : ''}).join('')}</div><span class="json-bracket">}</span>`
            }   
        }  else if (typeof jsonObj === 'string') {
            return `<span class="json-string">"${jsonObj}"</span>`
        } else if (typeof jsonObj === 'number') {
            return `<span class="json-number">${jsonObj}</span>`;
        } else if (typeof jsonObj === 'boolean') {
            return `<span class="json-boolean">${jsonObj}</span>`;
        }
    }

    // Update jsonObject when jsonString changes
    $: jsonObject = parseJSON(jsonString);
</script>

<div class="json-container" use:html={jsonObject ? createHTMLFromJSON(jsonObject) : ''}></div>

<style>
	.json-container {
		font-family: Arial, sans-serif;
		font-size: 14px;
		line-height: 1.5;
		white-space: pre-wrap;
	}
	.json-key {
		color: #c7254e;
		font-weight: bold;
	}
	.json-value {
		color: #31708f;
	}
	.json-string {
		color: #22863a;
	}
	.json-number {
		color: #b32d00;
	}
	.json-boolean {
		color: #ff9900;
	}
	.json-null {
		color: #ff0000;
	}
	.json-bracket {
		color: #666;
	}
	.indent {
		margin-left: 20px;
	}
</style>
