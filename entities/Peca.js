{
  "name": "Peca",
  "type": "object",
  "properties": {
    "nome": {
      "type": "string",
      "description": "Nome da pe\u00e7a"
    },
    "descricao": {
      "type": "string",
      "description": "Descri\u00e7\u00e3o da pe\u00e7a"
    },
    "categoria": {
      "type": "string",
      "enum": [
        "Mem\u00f3ria RAM",
        "HD / SSD",
        "Processador",
        "Placa-m\u00e3e",
        "Fonte",
        "Cooler",
        "Placa de V\u00eddeo",
        "Teclado",
        "Tela",
        "Bateria",
        "Cabo / Conector",
        "Outros"
      ],
      "description": "Categoria da pe\u00e7a"
    },
    "preco": {
      "type": "number",
      "description": "Pre\u00e7o de refer\u00eancia"
    },
    "link_compra": {
      "type": "string",
      "description": "Link do an\u00fancio (Mercado Livre, Amazon, etc.)"
    },
    "imagem_url": {
      "type": "string",
      "description": "URL da imagem da pe\u00e7a"
    },
    "loja": {
      "type": "string",
      "description": "Nome da loja (ex: Mercado Livre, Amazon, Kabum)"
    },
    "destaque": {
      "type": "boolean",
      "default": false,
      "description": "Exibir em destaque"
    },
    "disponivel": {
      "type": "boolean",
      "default": true,
      "description": "Dispon\u00edvel para compra"
    }
  },
  "required": [
    "nome",
    "link_compra"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "read": {
      "$or": [
        {
          "data.disponivel": true
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "update": {
      "user_condition": {
        "role": "admin"
      }
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}