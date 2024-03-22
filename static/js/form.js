(function () {
    // Document ready
    
    const form = document.getElementById("generate"),
    output = document.getElementById("output"),
    link = document.getElementById("output-link"),
    outputContainer = document.getElementById("output-container"),
    authorOriginal = document.querySelector(".original-author"),
    authorContainer = authorOriginal.parent,
    imgTag = document.querySelector("#imageContainer");
    
    
    
    
    const LICENSES = {
        "PublicDomainMark 1.0": 'https://creativecommons.org/publicdomain/mark/1.0/',
        "CC0-1.0": 'https://creativecommons.org/licenses/zero/1.0/',
        "CC-BY-4.0": 'https://creativecommons.org/licenses/by/4.0/',
        "CC-BY-SA-4.0": 'https://creativecommons.org/licenses/by-sa/4.0/',
        "etalab-2.0": 'https://spdx.org/licenses/etalab-2.0.html',
        "ODbL-1.0": 'https://opendatacommons.org/licenses/odbl/1-0/'
    };
    
    
    
    
    let idForAuthors = 0;
    
    const addAuthor = function (event) {
        event.preventDefault();
        // Retrieve element and their copy
        let new_elem = authorOriginal.cloneNode(true),
        add_button = new_elem.querySelector(".add-author"),
        remove_button = new_elem.querySelector(".remove-author"),
        checkboxes = new_elem.querySelectorAll(".form-check"),
        text_inputs = new_elem.querySelectorAll("input[type='text']");
        
        
        // Clean text inputs
        for (var i = text_inputs.length - 1; i >= 0; i--) {
            text_inputs[i].value = "";
        }
        
        // Make sure the labels and input have new IDs, as IDs are unique !
        for (var i = checkboxes.length - 1; i >= 0; i--) {
            let inp = checkboxes[i].querySelector("input"),
            cat = inp.value;
            inp.setAttribute("id", `cb-${cat}-${idForAuthors.toString()}`);
            checkboxes[i].querySelector("label").setAttribute("for", inp.id);
            inp.checked = null;
        }
        
        idForAuthors++;
        // Insert element in the DOM
        authorOriginal.after(new_elem);
        // Un-hide the element for removal
        remove_button.classList.remove("invisible");
        
        // Register events
        add_button.addEventListener("click", addAuthor);
        remove_button.addEventListener("click", function (ev) {
            new_elem.remove();
        });
    };
    
    document.querySelector(".add-author").addEventListener("click", addAuthor);
    const metricOriginal = document.querySelector(".metric-form");
    
    const addMetric = function (event) {
        event.preventDefault();
        // Retrieve element and their copy
        let new_elem = metricOriginal.cloneNode(true),
        add_button = new_elem.querySelector(".add-metric"),
        remove_button = new_elem.querySelector(".remove-metric"),
        options = new_elem.querySelectorAll("option[selected]"),
        text_inputs = new_elem.querySelectorAll("input[type='text']");
        
        
        // Clean text inputs
        for (var i = text_inputs.length - 1; i >= 0; i--) {
            text_inputs[i].value = "0";
        }
        
        idForAuthors++;
        // Insert element in the DOM
        metricOriginal.after(new_elem);
        // Un-hide the element for removal
        remove_button.classList.remove("d-none");
        
        // Register events
        add_button.addEventListener("click", addMetric);
        remove_button.addEventListener("click", function (ev) {
            new_elem.remove();
        });
    };
    
    document.querySelector(".add-metric").addEventListener("click", addMetric);
    
    
    const sourcesOriginal = document.querySelector(".sources-form");
    
    const addSources = function (event) {
        event.preventDefault();
        // Retrieve element and their copy
        let new_elem = sourcesOriginal.cloneNode(true),
        add_button = new_elem.querySelector(".add-sources"),
        remove_button = new_elem.querySelector(".remove-sources"),
        text_inputs = new_elem.querySelectorAll("input[type='text']");
        
        
        // Clean text inputs
        for (var i = text_inputs.length - 1; i >= 0; i--) {
            text_inputs[i].value = "";
        }
        
        idForAuthors++;
        // Insert element in the DOM
        sourcesOriginal.after(new_elem);
        // Un-hide the element for removal
        remove_button.classList.remove("d-none");
        
        // Register events
        add_button.addEventListener("click", addSources);
        remove_button.addEventListener("click", function (ev) {
            new_elem.remove();
        });
    };
    
    document.querySelector(".add-sources").addEventListener("click", addSources);
    
    const normalize = function (a_string) {
        return a_string.replace("'", "’");
    };
    
    
    const slugify = function slugify(str) {
        str = str.replace(/^\s+|\s+$/g, '');
        
        // Make the string lowercase
        str = str.toLowerCase();
        
        // Remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        
        // Remove invalid chars
        str = str.replace(/[^a-z0-9 -]/g, '')
        // Collapse whitespace and replace by -
        .replace(/\s+/g, '-')
        // Collapse dashes
        .replace(/-+/g, '-');
        
        return str;
    };
    
    const getAuthors = function () {
        let out = {
            "authors":[]
        },
        authors = document.querySelectorAll(".author");
        
        if (authors.length == 0) {
            return {
            };
        }
        for (var i = 0; i < authors.length; i++) {
            let surname = authors[i].querySelector("input[name='authoritySurname']").value,
            name = authors[i].querySelector("input[name='authorityName']").value,
            orcid = authors[i].querySelector("input[name='authorityORCID']").value,
            status = authors[i].querySelector("input[name='authorityType']:checked");
            
            if (name.trim() === "") {
                continue;
            }
            
            let a = {
                "name": name,
                "surname": surname
            }
            if (orcid.trim() !== "") {
                a[ "orcid"] = orcid;
            }
            let roles = authors[i].querySelectorAll("input[type='checkbox']:checked");
            if (roles.length > 0) {
                a.roles =[...roles].map((o) => o.value);
            }
            out.authors.push(a);
        }
        
        return out;
    };
    
    const getMetrics = function () {
        let text = {
            "volume":[]
        },
        metrics = document.querySelectorAll(".metric-form");
        
        if (metrics.length == 0) {
            return {
            };
        }
        for (var i = 0; i < metrics.length; i++) {
            let metric_count = metrics[i].querySelector("input[name='metric-count']").value,
            metric_metric = metrics[i].querySelector("select[name='metric-metric']").value;
            
            if (metric_count.trim() === "") {
                continue;
            }
            
            // DO NOT REINDENT
            text.volume.push({
                "metric": metric_metric,
                "count": parseInt(metric_count)
            });
        }
        if (text.volume.length === 0) {
            return {
            };
        }
        
        return text;
    };
    
    const getSources = function () {
        let text = {
            "sources":[]
        },
        sources = document.querySelectorAll(".sources-form");
        
        if (sources.length == 0) {
            return {
            };
        }
        for (var i = 0; i < sources.length; i++) {
            let sources_ref = sources[i].querySelector("input[name='sources-ref']").value,
            sources_link = sources[i].querySelector("input[name='sources-link']").value;
            
            if (sources_ref.trim() === "" && sources_link.trim() === "") {
                continue;
            }
            
            // DO NOT REINDENT
            text.sources.push({
                "reference": sources_ref,
                "link": sources_link
            });
        }
        if (text.sources.length == 0) {
            return {
            };
        }
        
        return text;
    };
    
    const languageSelect = new SelectPure(".language", {
        options: languages,
        multiple: true,
        autocomplete: true, // default: false
        value:[ "eng", "fra", "deu"],
        
        icon: "fa fa-times", // uses Font Awesome
        inlineIcon: false // custom cross icon for multiple select.
    });
    const langDetailsContainer = document.querySelector(".script-details-container");
    const updateScripts = function (scripts) {
      [...document.querySelectorAll("div.script-details")].forEach(function(el) {
        if (scripts.includes(el.getAttribute("data-script")) === false) {
          el.remove();
        }
        // Remove element not in scripts.
      });
      [...scripts].forEach(function(single_script) {
        let scriptDetails = document.querySelector(`div.script-details[data-script='${single_script}']`);
        if (scriptDetails) {
          return null;
        }
        langDetailsContainer.append(createElementFromHTML(`<div class="script-details row my-1" data-script="${single_script}">
          <label class="col-sm-3 col-form-label">- Script</label>
          <div class="col-md-3"><input type="text" value="${single_script}" name="script" class="form-control" disabled/></div>
          <label class="col-sm-3 col-form-label" for="script-detail-${single_script}">Details</label>
          <div class="col-md-3"><input type="text" value="" name="qualify" class="form-control" id="script-detail-${single_script}"/></div>
        </div>`));
      });
    };
    const scriptSelect = new SelectPure(".scripts", {
        options: scripts,
        multiple: true,
        autocomplete: true, // default: false
        value:[ "Latn", "Goth"],
        
        icon: "fa fa-times", // uses Font Awesome
        inlineIcon: false // custom cross icon for multiple select.
        onChange: (scripts) => { updateScripts(scripts) }
    });
    updateScripts(scriptSelect.value());
    let downloadBind = false;
    
    const escape_yaml = function (str) {
        return str.replace("'", "\\u0027")
    };
    
    const updateOrIgnore = function (field, key) {
        let out =[];
        if (field !== undefined && field.trim() != "") {
            out[key] = field;
        }
        return out;
    };
    
    
    
    const get_or_none_charriot = function (field, yaml) {
        if (field !== undefined && field.trim() != "") {
            return `${yaml}: >\n    ${field.split('\n').join('\n    ')}'`
        }
        return "";
    };
    
    document.querySelectorAll(".software-key").forEach((el) => {
        el.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelector("#software").value = el.innerText;
        })
    });

    const getScripts = function(values) {
      return values.map(function (local_script) {
        let qualify = document.querySelector(`#script-detail-${local_script}`);
        if (qualify && qualify.value.trim() != "") {
          return {"iso": local_script, "qualify": qualify.value};
        }
        return {"iso": local_script}
      });
    };
    
    
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(form));
        let languages = languageSelect.value().join("\n  - ");
        let scripts = scriptSelect.value().join("\n  - ");
        
        let obj = {
            "schema": `https://tboenig.github.io/gt-metadata/schema/2023-10-25/schema.json`,
            "title": normalize(data.repoName),
            "url": data.repoLink,...getAuthors(),
            "description": normalize(data.desc),...updateOrIgnore(data.projectName, "project-name"),...updateOrIgnore(data.projectWebsite, "project-website"),
            "language": languageSelect.value(),
            "production-software": data.software,
            "script": getScripts(scriptSelect.value()),
            "script-type": data.scriptType,
            "time": {
                "notBefore": data[ "date-begin"],
                "notAfter": data[ "date-end"]
            },
            "hands": {
                "count": data.hands,
                "precision": data.precision,
                "level": data.level
            },
            "license":[ {
                "name": data.license, "url": LICENSES[data.license]
            }],
            
            "gtType": data.gformat,
            
            "format": data.format,...getSources(),...getMetrics(),...updateOrIgnore(data.cff, 'citation-file-link'),...updateOrIgnore(data.transcriptionGuidelines, 'transcription-guidelines'),...updateOrIgnore(data.ocrmodel, "modeltitle"),...updateOrIgnore(data.ocrdesc, "modeldescription"),...updateOrIgnore(data.ocrmodellink, "modelurl"),...updateOrIgnore(data.ocrmodelengine, "modelengine"),
        };
        
        output.innerText = jsyaml.dump(obj, {
            "noRef": true
        });
        outputContainer.classList.remove("d-none");
        
        
        
        getOutputIssueText = function () {
            return encodeURIComponent(`Hello !\nThank you for your ground truth repository and catalog.\nRegards\n\nHere is our dataset YAML file: \n \`\`\`yaml\n${output.innerText}\`\`\``);
        }
        
        getOutputMetadataText = function () {
            return encodeURIComponent(`${output.innerText}`);
        }
        
        
        // Flexibility for default branch
        // GitHub repository information (URL, Owner, Repo)
        const url = `${data.repoLink}`;
        const urlPart = url.split("/").slice(-2).join("/");
        
        
        // GitHub API-endpoint for repository information
        const apiUrl = `https://api.github.com/repos/${urlPart}`;
        
        // function to retrieve the data from the API
        async function getDefaultBranch() {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                
                const defaultBranch = data.default_branch;
                return defaultBranch;
            }
            // error handling
            catch (error) {
                console.error('Error when retrieving the data:', error);
                throw error; // You could also keep throwing the error so that it is handled by calling functions
            }
        }
        // Call the function
        (async () => {
            try {
                const defaultBranch = await getDefaultBranch();
                link.href = `${url}/new/${defaultBranch}?filename=METADATA.yml&value=${getOutputMetadataText()}`;
            }
            catch (error) {
                console.error('Error when retrieving the data:', error);
            }
        })();
        
        //Call the function <createIssueLink>
        // link.href = `${(data.repoLink)}/new/${defaultBranch}?filename=METADATA.yml&value=${getOutputMetadataText()}`;
        createIssueLink.href = `https://github.com/HTR-United/htr-united/issues/new?title=Adding%20dataset%20${(data.repoName)}&body=${getOutputIssueText()}`;
        
        
        
        if (downloadBind === false) {
            document.querySelector("#download").addEventListener("click", function (e) {
                e.preventDefault();
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(document.querySelector("#output").innerText));
                element.setAttribute('download', "METADATA.yml");
                
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            });
            downloadBind = true;
        }
    });
})();
