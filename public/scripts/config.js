"use strict";

 angular.module('config', [])

.constant('STREAMACTION', {list:'list',listUnpublished:'listUnpublished',upload:'upload',request:'request',requestUnpublished:'requestUnpublished'})

.constant('ENV', {name:'development',backendEndpoint:'localhost',backendPort:'3000',apiEndpoint:'http://your-development.api.endpoint:3000'})

;