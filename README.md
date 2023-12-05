# gt-metadata
gt-metadata is a tool for collecting metadata from ground truth data records. Data on the dataset (including title, short description, project reference, license) 
and references to OCR models can be recorded. The metadata data is saved in YAML format and can be automatically saved in the repository of the Ground Truth dataset 
and in the [HTR-United catalog](https://htr-united.github.io/catalog.html). The HTR-United catalog lists various GT datasets and OCR/HTR models.

With the availability of the gt-metadata tool the [HTR-Data Reuse Charter](https://htr-united.github.io/data-reuse-charter.html) is followed.
This offering follows the principles of Reciprocity, Interoperability, Citability, Openness, Stewardship and Trustworthiness. 
This tool builds on the [HTR-United tool](https://github.com/HTR-United/htr-united.github.io). It has been reduced and extended.


## Metadata Schema (JSON format)
gt-metadata supports the current metadata schema.

- https://github.com/tboenig/gt-metadata/blob/master/schema/2022-03-15/schema.json
- https://github.com/tboenig/gt-metadata/blob/master/schema/2023-10-25/schema.json


## Extensions that differ from those of HTR-United:
- A German translation 

The metadata schema has been extended by:
- the ground truth type
- the declaration of an OCR model

