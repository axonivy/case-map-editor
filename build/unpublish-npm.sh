#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/case-map-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/case-map-editor-protocol@${1}" --registry $REGISTRY
