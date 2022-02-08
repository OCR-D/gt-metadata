(function(){
    const i18n_languages = [
      "Français",
      "English"
    ];
    let default_language = navigator.language || navigator.userLanguage; 
    if (default_language.startsWith("en-")) { default_language = "English"; }
    else if (default_language.startsWith("fr-")) { default_language = "Français"; }
    else { default_language = "English"; }
    

    new vanilla_i18n (
      i18n_languages,
      opts = {
        path: "assets/vanilla-i18n",
        debug: true,
        i18n_attr_name: "vanilla-i18n",
        toggler_id: "vanilla-i18n-toggler",
        default_language: i18n_languages[0],
      }
    ).run();
})();