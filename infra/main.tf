terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  # State remoto (recomendado para equipos y CI/CD).
  # Descomenta y ajusta después de crear el Storage Account del state.
  # backend "azurerm" {
  #   resource_group_name  = "tfstate-rg"
  #   storage_account_name = "tfstateunico123"
  #   container_name       = "tfstate"
  #   key                  = "webapp.dev.tfstate"
  # }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id # obligatorio en azurerm v4
}

# ---------------------------------------------------------------------------
# Variables
# ---------------------------------------------------------------------------
variable "subscription_id" {
  description = "ID de la suscripción de Azure"
  type        = string
}

variable "app_name" {
  description = "Nombre de la Web App (debe ser único globalmente en Azure)"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, qa, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Región de Azure"
  type        = string
  default     = "eastus"
}

variable "sku_name" {
  description = "SKU del App Service Plan (B1, S1, P1v3, ...)"
  type        = string
  default     = "B1"
}

variable "node_version" {
  description = "Versión de Node.js del runtime"
  type        = string
  default     = "20-lts"
}

# ---------------------------------------------------------------------------
# Recursos
# ---------------------------------------------------------------------------
locals {
  tags = {
    environment = var.environment
    managed_by  = "terraform"
    app         = var.app_name
  }
}

resource "azurerm_resource_group" "rg" {
  name     = "${var.app_name}-${var.environment}-rg"
  location = var.location
  tags     = local.tags
}

resource "azurerm_service_plan" "plan" {
  name                = "${var.app_name}-${var.environment}-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = var.sku_name
  tags                = local.tags
}

resource "azurerm_linux_web_app" "app" {
  name                = "${var.app_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.plan.id
  https_only          = true
  tags                = local.tags

  site_config {
    always_on = var.sku_name != "F1" # F1 (free) no soporta always_on

    application_stack {
      node_version = var.node_version
    }
  }

  # Variables de entorno de la app. NO pongas secretos aquí en texto plano.
  app_settings = {
    NODE_ENV = var.environment
  }
}

# ---------------------------------------------------------------------------
# Outputs
# ---------------------------------------------------------------------------
output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "web_app_name" {
  value = azurerm_linux_web_app.app.name
}

output "web_app_url" {
  value = "https://${azurerm_linux_web_app.app.default_hostname}"
}
