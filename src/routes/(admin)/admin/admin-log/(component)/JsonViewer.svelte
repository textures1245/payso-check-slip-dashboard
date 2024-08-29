<!-- JsonViewer.svelte -->
<script>
// @ts-nocheck

  export let data = {};

  // Function to remove sensitive fields
  /**
	 * @param {any} obj
	 */
  function removeSensitiveData(obj) {
    // Deep copy the object
    let result = JSON.parse(JSON.stringify(obj));

    /**
	   * @param {{ [x: string]: any; hasOwnProperty: (arg0: string) => any; }} o
	   */
    function removeField(o) {
      for (let key in o) {
        if (o.hasOwnProperty(key)) {
          if (key.toLowerCase().includes('password')) {
            delete o[key]; // Remove the sensitive field
          } else if (typeof o[key] === 'object' && o[key] !== null) {
            removeField(o[key]); // Recurse into nested objects
          }
        }
      }
    }

    removeField(result);
    return result;
  }

  // Function to format JSON data
  /**
	 * @param {string} json
	 */
  function formatJson(json) {
    try {
      // Parse the JSON string
      let parsedJson = JSON.parse(json);

      // Remove sensitive data
      parsedJson = removeSensitiveData(parsedJson);

      // Handle 'data_body' field if present
      if (parsedJson.data_body) {
        parsedJson.data_body = JSON.parse(parsedJson.data_body);
        parsedJson.data_body = removeSensitiveData(parsedJson.data_body);
      }

      // Return formatted JSON
      return JSON.stringify(parsedJson, null, 2);
    } catch (e) {
      // Return original JSON if parsing fails
      return json;
    }
  }
</script>

<style>
  .json-viewer {
    font-family: monospace;
    white-space: pre-wrap;
    background: #f0f0f0;
    padding: 1em;
    border-radius: 4px;
    overflow: auto;
    max-height: 300px;
  }
</style>

<div class="json-viewer">
  {@html formatJson(data)}
</div>
