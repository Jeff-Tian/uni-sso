#!/bin/bash

k8ss switch --cluster=kubesail --namespace=jeff-tian
kubectl apply -k inf/prod
kubectl -n jeff-tian rollout restart deployment uni-sso

sh trigger-assertible.sh
