provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "greenprint-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway = true
  
  tags = {
    Project = "GreenPrint"
    Environment = var.environment
  }
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "greenprint-cluster"
  cluster_version = "1.28"
  
  vpc_id  = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  eks_managed_node_groups = {
    greenprint_nodes = {
      desired_size = 2
      max_size     = 3
      min_size     = 1
      
      instance_types = ["t3.medium"]
    }
  }
  
  tags = {
    Project = "GreenPrint"
    Environment = var.environment
  }
}
