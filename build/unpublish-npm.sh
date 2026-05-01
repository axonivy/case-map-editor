#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/case-map-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/case-map-editor-protocol@${1}" --registry $REGISTRY
