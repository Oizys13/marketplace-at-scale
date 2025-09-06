# Stop on errors
$ErrorActionPreference = "Stop"

Write-Host "Checking if cluster already exists..."
$clusters = kind get clusters

if ($clusters -notmatch "marketplace") {
    Write-Host "Creating kind cluster 'marketplace'..."
    kind create cluster --name marketplace
}
else {
    Write-Host "Cluster 'marketplace' already exists."
}

Write-Host "Building Docker images..."
docker build -t listings-service:latest ./services/listings
docker build -t worker-service:latest ./services/worker

Write-Host "Loading images into kind..."
kind load docker-image listings-service:latest --name marketplace
kind load docker-image worker-service:latest --name marketplace

Write-Host "Images loaded into kind cluster."