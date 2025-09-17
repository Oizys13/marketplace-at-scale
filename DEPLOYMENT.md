# Deployment Guide

This document explains how to deploy the Marketplace-at-Scale project using Docker, Kubernetes, and Kind.

---

## Prerequisites

- Docker installed and running
- Kind (Kubernetes in Docker) installed
- kubectl installed and configured

---

## Step 1: Run the deployments scripts

First run:

```bash
docker-compose up 
```

Then:

```bash
.\scripts\kind-setup.ps1
```

This will create a Kind Cluster and then loads the built images into it.

Then:

```bash
.\scripts\deploy.ps1
```

This will apply the Kubernetes manifests of the following services: listings, worker, postgres, rabbitmq.

## Step 2: Apply Kubernetes Manifests

Deploy all Kubernetes manifests from the k8s/ directory:

```bash
kubectl apply -f k8s/
```

## Step 3: Verify Pods

Check that all pods are running:

```bash
kubectl get pods -o wide
```

## Step 4: Logs

Check logs for each deployment:

```bash
kubectl logs deploy/listings-deployment --tail=100
kubectl logs deploy/worker-deployment --tail=100
```

## Step 5: Troubleshooting

If you see ErrImagePull, ensure you have built and loaded the images with Kind correctly.

If you see ECONNREFUSED on port 5672, check that the RabbitMQ service is running and the RABBITMQ_URL env variable is correctly set to amqp://rabbitmq:5672.

To delete all deployments and start fresh:

```bash
kubectl delete deployments --all
kubectl delete services --all
```

## Step 6: Testing the Listings and Worker Services

Follow these steps to test that the `listings-service` can accept requests and the `worker-service` processes them correctly.

1. **Port-forward the Listings Service**

   In one terminal, run:

   ```bash
   kubectl port-forward svc/listings-service 3002:3002
   ```

   This makes the listings-service accessible at http://localhost:3002.

2. **Send a Test Listing Request**

    In another terminal (PowerShell):

    ```bash
    Invoke-RestMethod -Uri "http://localhost:3002/listings" `
    -Method POST `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body '{"title":"Test","price":100}'
    ```
    
    This should create a test listing and send a message to RabbitMQ.

3. **Check Worker Logs**

    To see what the worker is processing, run:

    ```bash
    kubectl logs -f deploy/worker-deployment
    ```

    This will stream logs from the worker. You should see it consume the ListingCreated event and acknowledge the message.

## Step 7: CI/CD with GitHub Actions

1-Create the workflow file at .github/workflows/ci.yml.
2-Install act.

3-From the project root, run:

```bash
act -j build-and-test
```
