(function() { // Document ready

    const form = document.getElementById("generate"),
        output = document.getElementById("output"),
        link = document.getElementById("output-link"),
        authorOriginal = document.querySelector(".original-author"),
        authorContainer = authorOriginal.parent;

    let idForAuthors = 0;

    const addAuthor = function(event) {
      event.preventDefault();
      // Retrieve element and their copy
      let new_elem = authorOriginal.cloneNode(true),
          add_button = new_elem.querySelector(".add-author"),
          remove_button = new_elem.querySelector(".remove-author"),
          checkboxes = new_elem.querySelectorAll(".form-check-inline"),
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
      remove_button.addEventListener("click", function(ev) { new_elem.remove(); });
    };


    document.querySelector(".add-author").addEventListener("click", addAuthor);

    const metricOriginal = document.querySelector(".metric-form");

    const addMetric = function(event) {
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
      remove_button.addEventListener("click", function(ev) { new_elem.remove(); });
    };

    document.querySelector(".add-metric").addEventListener("click", addMetric);

    const normalize = function(a_string) {
      return a_string.replace("'", "’");
    };


    const slugify = function slugify(str) {
        str = str.replace(/^\s+|\s+$/g, '');

        // Make the string lowercase
        str = str.toLowerCase();

        // Remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
        for (var i=0, l=from.length ; i<l ; i++) {
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
      let text = "\nauthors:",
          authors = document.querySelectorAll(".author");

      if (authors.length == 0) {
        return "";
      }
      for (var i = 0; i < authors.length; i++) {
        let surname = authors[i].querySelector("input[name='authoritySurname']").value,
            name = authors[i].querySelector("input[name='authorityName']").value;

        if (name.trim() === "") { continue; }

        // DO NOT REINDENT
        text = text + `\n    - name: '${name}'
      surname: '${surname}'`;


        let roles = authors[i].querySelectorAll("input[type='checkbox']:checked");
        if (roles.length > 0) {
          text = text + "\n      roles:"
        }
        for (var j = 0; j < roles.length; j++) {
          // DO NOT REINDENT
          text = text + `
      - '${roles[j].value}'`;
        }
      }

      return text;
    };    

    const getMetrics = function () {
      let text = "\nvolume:",
          metrics = document.querySelectorAll(".metric-form");

      if (metrics.length == 0) {
        return "";
      }
      for (var i = 0; i < metrics.length; i++) {
        let metric_count = metrics[i].querySelector("input[name='metric-count']").value,
            metric_metric = metrics[i].querySelector("select[name='metric-metric']").value;

        if (metric_count.trim() === "") { continue; }

        // DO NOT REINDENT
        text = text + `\n  - metric: '${metric_metric}'\n    count: '${metric_count}'`;
      }

      return text;
    };

    const languageSelect = new SelectPure(".language", {
        options: languages,
        multiple: true,
        autocomplete: true, // default: false
        value: ["frm", "fro", "lat", "eng", "fra"], 

        icon: "fa fa-times", // uses Font Awesome
        inlineIcon: false // custom cross icon for multiple select.
    });
    const scriptSelect = new SelectPure(".scripts", {
        options: scripts,
        multiple: true,
        autocomplete: true, // default: false
        value: ["Latn"],
            
        icon: "fa fa-times", // uses Font Awesome
        inlineIcon: false // custom cross icon for multiple select.
    });


    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let data = Object.fromEntries(new FormData(form));
      let languages = languageSelect.value().join("\n  - ");
      let scripts = scriptSelect.value().join("\n  - ");

      output.innerText = `title : '${normalize(data.repoName)}'
url: '${data.repoLink}'
project-name: '${data.projectName}'
project-website: '${data.projectWebsite}'${getAuthors()}
description: '${normalize(data.desc)}'
language:
  - ${languages}
script: 
  - ${scripts}
script-type: '${data.scriptType}'
time: 
  start: ${data["date-begin"]}
  end: ${data["date-end"]}
hands: 
  count: '${data.hands}'
  precision: '${data.precision}'
license:
  - ${data.license}
format: '${data.format}'${getMetrics()}
`;
    output.classList.remove("invisible");
    link.classList.remove("invisible");
    link.href = `https://github.com/HTR-United/htr-united/new/master?filename=catalog/${slugify(data.projectName)}.yml`;

    });
})();