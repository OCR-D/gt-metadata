const catalogURI = "https://htr-united.github.io/htr-united/catalog.json";
const catalogDiv = document.querySelector("#card-receiver"),
  notAfterSelector = document.querySelector("#notAfter"),
  notBeforeSelector = document.querySelector("#notBefore"),
  scriptTypeFilter = document.querySelector("#scriptType"),
  resultCount = document.querySelector("#resultCount"),
  showGuidelines = document.querySelector("#showGuidelines"),
  showCitations = document.querySelector("#showCitations");
let msnry;

/**
 * 
 * DOM Generic functions
 * 
 * */

function toggleGuidelines() {
  /** Toggles the visibility of guidelines */
  if (showGuidelines.checked) {
    catalogDiv.classList.add("show-guidelines");
  } else {
    catalogDiv.classList.remove("show-guidelines");
  }
}

function toggleCitations() {
  /** Toggles the visibility of citations */
  if (showCitations.checked) {
    catalogDiv.classList.add("show-citations");
  } else {
    catalogDiv.classList.remove("show-citations");
  }
}

function selectText(node) {
  /** Select the text inside `node` */
  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

/**
 * 
 * UTILS
 * 
 * */

function nl2br(str) {
  /* Replace line breaks with <br/> HTML tags inside `str` */
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
}

function createElementFromHTML(htmlString) {
  /* Transform the html string into a HTML node */
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

function slugify(str) {
  /* Slugify the string (normalize for id, links, etc) */
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
}

/**
 * 
 * Catalog HTML production
 * 
 * */

function getVolumes(listOfValue) {
  /* Produces a HTML sequence of volume badges based on a the Volume Catalog Entry list */
  return listOfValue.map((val) => `<span class="badge badge-sm p-0 m-1 mb-3"><span class="bg-volumes rounded-start text-white border border-secondary border-end-0 py-1 px-2"><span class="fas fa-database"></span> Volume</span><span class="rounded-end text-dark border border-secondary py-1 px-2">${val.count.toLocaleString()} ${val.metric}</span></span>`).join(" ")
}

function getImages(listOfValue, label, color) {
  /* Produces a HTML sequence of volume badges based on a list of string 
   *    (label is used as the left label, color as the css color class) 
   * */
  return listOfValue.map((val) => `<span class="badge badge-sm p-0 m-1 mb-3"><span class="bg-${color}  rounded-start text-white border border-secondary border-end-0 py-1 px-2">${label}</span><span class="rounded-end text-dark border border-secondary py-1 px-2">${val}</span></span>`).join(" ")
}

function getTypeBadge(scriptType) {
  /* Produces a HTML badge based on the script type values
   * */
  if (typeof scriptType !== "string") {
    return "";
  }
  let badge = "fa-archive";
  if (scriptType.includes("manuscript")) {
    badge = "fa-pen-fancy";
  } else if (scriptType.includes("typed")) {
    badge = "fa-print";
  }
  return `<span class="badge badge-sm p-0 m-1 mb-3">
        <span class="bg-script-type rounded-start text-white border border-secondary border-end-0 py-1 px-2">Script Type</span><span class="rounded-end border border-secondary text-dark py-1 px-2"><span class="fas ${badge}"></span> ${scriptType}</span>
      </span>`
}

function citationCFF(link) {
  /** Creates a citation link if the entry is given */
  if (link) {
    return `<a href="${link}"><span class="badge badge-sm p-0 m-1 mb-3"><span class="bg-link rounded-start text-white border border-secondary border-end-0 py-1 px-2"><span class="fa fa-link"></span> Link</span><span class="rounded-end border border-secondary text-dark py-1 px-2">Citation File</span></span>
      </a>`;
  } else {
    return "";
  }
}

function getAuthors(catalogEntry) {
  /** Creates a HTML paragraph with a list of authors */
  if (catalogEntry.authors) {
    return `<p class="card-text"><b><i18n vanilla-i18n="cat.authors">Auteur.rice.s </i18n>:</b> ${catalogEntry.authors.map((val) => val.name + ', ' + val.surname).join(' and ')}</p>`;
  } else {
    return "";
  }
}

function transcriptionRules(catalogEntry) {
  /** Creates a HTML section with the transcription guidelines */
  if (catalogEntry['transcription-guidelines']) {
    return `<div class="card-body transcriptionRules">
    <h6 vanilla-i18n="form.field.guidelines.label">Transcriptions Guidelines</h6>
    <p class="card-text">${catalogEntry['transcription-guidelines']}</p>
  </div>`;
  } else {
    return "";
  }
}

function template(catalogEntry, key) {
  /** Generates the whole DIV for a specific catalog entry with `key` in the original JSON */
  return createElementFromHTML(`<div class="card catalog-card" data-key="${key}">
  <div class="card-header bg-secondary rounded-top">
  ${catalogEntry.title}
  </div>
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${catalogEntry['project-name'] || ''}</h6>
    <h7 class="pb-4">${catalogEntry.time.notBefore.split('-')[0]}--${catalogEntry.time.notAfter.split('-')[0]}</h7>
    <p>
      <a href="${catalogEntry.url}"><span class="badge badge-sm p-0 m-1 mb-3"><span class="bg-link rounded-start text-white border border-secondary border-end-0 py-1 px-2"><span class="fa fa-link"></span> Link</span><span class="rounded-end border border-secondary text-dark py-1 px-2">Data</span></span></a>
      ${citationCFF(catalogEntry['citation-file-link'])}
    </p>
    <hr />
    <p class="my-0">
      ${getImages(catalogEntry.language, "Language", "language")}
      ${getImages(catalogEntry.script, "Script", "script")}
      ${getTypeBadge(catalogEntry['script-type'])}
      <span class="badge badge-sm p-0 m-1 mb-3"><span class="bg-hands rounded-start text-white border border-secondary border-end-0 py-1 px-2">Hands</span><span class="rounded-end border border-secondary text-dark py-1 px-2">${catalogEntry.hands.count}</span></span>
    </p>
    <p class="my-0">${getVolumes(catalogEntry.volume)}</p>
    <p class="my-0">
      <span class="badge badge-sm p-0 m-1 mb-3"><span class="bg-license rounded-start text-white border border-secondary border-end-0 py-1 px-2">License</span><span class="rounded-end border border-secondary text-dark py-1 px-2">${catalogEntry.license[0].name}</span></span>
    </p>
    <hr/>
    <p class="card-text">${nl2br(catalogEntry.description)}</p>
    ${getAuthors(catalogEntry)}
  </div>
  ${transcriptionRules(catalogEntry)}
  <div class="card-body citation">
  <h6>Citation <span class="fa fa-copy citation-copy"></span></h6>
  <pre>
@misc{htr_united_${slugify(catalogEntry.url)},
  type       = dataset,
  author     = {${(catalogEntry.authors || []).map((val) => val.name + ', ' + val.surname).join(' and ')}},
  title      = {${catalogEntry.title}},
  publisher  = {HTR United},
  editor     = {Chagué, Alix and Clérice, Thibault},
  url        = {${catalogEntry.url}}
}</pre>
</div>
</div>`);
}

/**
 *
 * Catalog Retrieval and display
 * 
 * */

async function getCatalog() {
  /* Retrieves the catalog data */
  try {
    var res = await fetch(catalogURI);
    return res.json();
  } catch {
    (error) => {
      console.log(error.message);
      return;
    };
  }
};

async function showCatalog() {
  /* Insert the catalog in the HTML */
  const CATALOG = await getCatalog();

  let minDate = +5000,
    maxDate = -5000;

  // Produce and 
  Object.keys(CATALOG).sort((key1, key2) => (CATALOG[key1].title < CATALOG[key2].title) ? -1 : 1).forEach((key) => {
    let div = template(CATALOG[key], key);
    try {
      CATALOG[key].time.notBeforeInt = parseInt(CATALOG[key].time.notBefore.split("-")[0]);
      CATALOG[key].time.notAfterInt = parseInt(CATALOG[key].time.notAfter.split("-")[0]);
      if (CATALOG[key].time.notAfterInt > maxDate) {
        maxDate = CATALOG[key].time.notAfterInt;
      }
      if (CATALOG[key].time.notBeforeInt < minDate) {
        minDate = CATALOG[key].time.notBeforeInt;
      }
    } catch (e) {
      console.log("Error on parsing time for " + key);
      console.log(e);
    }
    catalogDiv.append(div);
  });
  catalogDiv.querySelectorAll(".citation").forEach((divEl) => {
    divEl.querySelector(".citation-copy").addEventListener("click", function(e) {
      selectText(divEl.querySelector("pre"));
      document.execCommand("copy");
    })
  });
  notBeforeSelector.value = minDate;
  notAfterSelector.value = maxDate;

  function inRange(minStart, minEnd, dataStart, dataEnd) {
    return (dataStart <= minEnd) && (minStart <= dataEnd);
  }

  function scriptTypeFilterFn(entry, filterValue) {
    if (filterValue == "all") {
      return true;
    }
    return (entry['script-type'] == filterValue);
  }

  function updateResultCount() {
    resultCount.innerText = catalogDiv.querySelectorAll(".card:not([style*='none'])").length;
  }

  function applyFilters() {
    let localMin = parseInt(notBeforeSelector.value),
      localMax = parseInt(notAfterSelector.value),
      localScriptTypeFilter = scriptTypeFilter.value;

    document.querySelectorAll(".catalog-card").forEach((div) => {
    	div.style.display = "none";
    	div.style.visibility = "hidden"
    });
    Object.keys(CATALOG).forEach((key) => {
      if (
        // Filter for dates
        (inRange(localMin, localMax, CATALOG[key].time.notBeforeInt, CATALOG[key].time.notAfterInt)) &&
        // Filter for script
        (scriptTypeFilterFn(CATALOG[key], localScriptTypeFilter))
      ) {
        let ldiv = document.querySelector(`.catalog-card[data-key="${key}"]`)
    	ldiv.style.display = "block";
    	ldiv.style.visibility = "visible";
      }
    });
    updateResultCount();
    //msnry.reloadItems();
    //msnry.layout();
  };
  notBeforeSelector.addEventListener('change', applyFilters);
  notAfterSelector.addEventListener('change', applyFilters);
  scriptTypeFilter.addEventListener('change', applyFilters);
  toggleGuidelines();
  toggleCitations();
  i18n_item.run();
  /*
  msnry = new Masonry('.grid', {
    // set itemSelector so .grid-sizer is not used in layout
    itemSelector: '.grid-item',
    // use element for option
    columnWidth: '.catalog-card',
    percentPosition: true
  });
  */
  applyFilters();
  /**
   * Apply Masonry
   * 
   * */
}
showGuidelines.addEventListener("change", toggleGuidelines);
showCitations.addEventListener("change", toggleCitations);
showCatalog();