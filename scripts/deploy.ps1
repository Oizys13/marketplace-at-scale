# Stop on errors
$ErrorActionPreference = "Stop"

Write-Host "Applying Kubernetes manifests..."

kubectl apply -f ./k8s/postgres-deployment.yaml
kubectl apply -f ./k8s/rabbitmq-deployment.yaml
kubectl apply -f ./k8s/listings-deployment.yaml
kubectl apply -f ./k8s/worker-deployment.yaml

Write-Host "All manifests applied."
