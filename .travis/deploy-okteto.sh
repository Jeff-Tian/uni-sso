k8ss switch --cluster=okteto --namespace=jeff-tian
kubectl apply -k inf
kubectl -n jeff-tian rollout restart deployment uni-sso
