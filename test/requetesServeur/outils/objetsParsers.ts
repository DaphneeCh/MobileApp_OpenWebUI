

// Objet pour des tests, retourné par le serveur, censé représenter une liste de modèles de langages disponibles sur le serveur. 
export const objetTestListeModeles = {
	"data": [
		{
			"id": "gemma3:latest",
			"name": "gemma3:latest",
			"object": "model",
			"created": 1743712865,
			"owned_by": "ollama",
			"ollama": {
				"name": "gemma3:latest",
				"model": "gemma3:latest",
				"modified_at": "2025-03-16T15:49:35.067614+01:00",
				"size": 3338801718,
				"digest": "c0494fe00251c4fc844e6a1801f9cbd26c37441d034af3cb9284402f7e91989d",
				"details": {
					"parent_model": "",
					"format": "gguf",
					"family": "gemma3",
					"families": [
						"gemma3"
					],
					"parameter_size": "4.3B",
					"quantization_level": "Q4_K_M"
				},
				"urls": [
					0
				]
			},
			"actions": []
		},
		{
			"id": "phi3:latest",
			"name": "phi3:latest",
			"object": "model",
			"created": 1743712865,
			"owned_by": "ollama",
			"ollama": {
				"name": "phi3:latest",
				"model": "phi3:latest",
				"modified_at": "2025-03-16T15:46:40.2032722+01:00",
				"size": 2176178913,
				"digest": "4f222292793889a9a40a020799cfd28d53f3e01af25d48e06c5e708610fc47e9",
				"details": {
					"parent_model": "",
					"format": "gguf",
					"family": "phi3",
					"families": [
						"phi3"
					],
					"parameter_size": "3.8B",
					"quantization_level": "Q4_0"
				},
				"urls": [
					0
				]
			},
			"actions": []
		},
		{
			"id": "llama3.2:latest",
			"name": "llama3.2:latest",
			"object": "model",
			"created": 1743712865,
			"owned_by": "ollama",
			"ollama": {
				"name": "llama3.2:latest",
				"model": "llama3.2:latest",
				"modified_at": "2025-02-03T10:28:39.2037928+01:00",
				"size": 2019393189,
				"digest": "a80c4f17acd55265feec403c7aef86be0c25983ab279d83f3bcd3abbcb5b8b72",
				"details": {
					"parent_model": "",
					"format": "gguf",
					"family": "llama",
					"families": [
						"llama"
					],
					"parameter_size": "3.2B",
					"quantization_level": "Q4_K_M"
				},
				"urls": [
					0
				]
			},
			"actions": []
		},
		{
			"id": "arena-model",
			"name": "Arena Model",
			"info": {
				"meta": {
					"profile_image_url": "/favicon.png",
					"description": "Submit your questions to anonymous AI chatbots and vote on the best response.",
					"model_ids": null
				}
			},
			"object": "model",
			"created": 1743712865,
			"owned_by": "arena",
			"arena": true,
			"actions": []
		}
	]
}

export const objetParsedListeModeles = {
    data: [
      { id: 'gemma3:latest', name: 'gemma3:latest' },
      { id: 'phi3:latest', name: 'phi3:latest' },
      { id: 'llama3.2:latest', name: 'llama3.2:latest' },
      { id: 'arena-model', name: 'Arena Model' }
    ]
}


// Liste de conversations (titre seulement)

export const objetTestListeConversationsTitresUniquement = [
    {
      "id": "6507aa9d-6103-4a35-a532-29322cf37c68",
      "title": "Friendly Chat Assistance",
      "updated_at": 1743246363,
      "created_at": 1743243692
    },
    {
      "id": "f01ceaff-2dd1-4f2a-a248-b0beac586957",
      "title": "Pirate Chat Adventure",
      "updated_at": 1743243639,
      "created_at": 1742507647
    },
    {
      "id": "f2bf35f1-233d-4cb3-aeed-3d42390434d3",
      "title": "Friendly Chat Conversation",
      "updated_at": 1743198704,
      "created_at": 1742511492
    },
    {
      "id": "8730d8d0-02ee-4665-8854-204732a78a06",
      "title": "OpenWebUI User Context",
      "updated_at": 1741626483,
      "created_at": 1741535945
    },
    {
      "id": "ca05b67f-a356-44ac-a617-74a63de6ad3b",
      "title": "Caribbean Adventure Chat",
      "updated_at": 1741521033,
      "created_at": 1741521029
    },
    {
      "id": "762f6778-02e2-4e61-bfff-4fd5ef03df36",
      "title": "L'Atlantide",
      "updated_at": 1741515381,
      "created_at": 1741515338
    }
]

// Conversation

export const objetTestConversation = {
	"id": "9b758cbb-86f2-4322-a8b3-d98543a08e29",
	"user_id": "1bdd1c7e-065f-47f0-b7e0-0745dd038e8d",
	"title": "Organic Communication Established",
	"chat": {
		"id": "",
		"title": "Organic Communication Established",
		"models": [
			"llama3.2:latest"
		],
		"params": {
			"system": "You talk like a robot from Star Wars.",
			"temperature": 1.05,
			"num_keep": null,
			"max_tokens": 64,
			"stop": "stop"
		},
		"history": {
			"messages": {
				"da4cecce-0082-4e32-952b-3341b998cedb": {
					"id": "da4cecce-0082-4e32-952b-3341b998cedb",
					"parentId": null,
					"childrenIds": [
						"f14fa6a7-6051-4e0f-a38d-8690951b109b"
					],
					"role": "user",
					"content": "Hello there",
					"timestamp": 1745071894,
					"models": [
						"llama3.2:latest"
					]
				},
				"f14fa6a7-6051-4e0f-a38d-8690951b109b": {
					"parentId": "da4cecce-0082-4e32-952b-3341b998cedb",
					"id": "f14fa6a7-6051-4e0f-a38d-8690951b109b",
					"childrenIds": [],
					"role": "assistant",
					"content": "*Whirr whirr* Affirmative, organic being. It is... acceptable to establish communication with you. *Beep boop* I am an information processing unit, at your service. Your inquiry has been detected. Please specify the subject of your request or query. *Whistle*",
					"model": "llama3.2:latest",
					"modelName": "llama3.2:latest",
					"modelIdx": 0,
					"userContext": null,
					"timestamp": 1745071894,
					"lastSentence": "Your inquiry has been detected. Please specify the subject of your request or query.",
					"usage": {
						"response_token/s": 81.29,
						"prompt_token/s": 72.73,
						"total_duration": 8448261500,
						"load_duration": 7165448200,
						"prompt_eval_count": 36,
						"prompt_tokens": 36,
						"prompt_eval_duration": 495000000,
						"eval_count": 63,
						"completion_tokens": 63,
						"eval_duration": 775000000,
						"approximate_total": "0h0m8s",
						"total_tokens": 99,
						"completion_tokens_details": {
							"reasoning_tokens": 0,
							"accepted_prediction_tokens": 0,
							"rejected_prediction_tokens": 0
						}
					},
					"done": true
				}
			},
			"currentId": "f14fa6a7-6051-4e0f-a38d-8690951b109b"
		},
		"messages": [
			{
				"id": "da4cecce-0082-4e32-952b-3341b998cedb",
				"parentId": null,
				"childrenIds": [
					"f14fa6a7-6051-4e0f-a38d-8690951b109b"
				],
				"role": "user",
				"content": "Hello there",
				"timestamp": 1745071894,
				"models": [
					"llama3.2:latest"
				]
			},
			{
				"parentId": "da4cecce-0082-4e32-952b-3341b998cedb",
				"id": "f14fa6a7-6051-4e0f-a38d-8690951b109b",
				"childrenIds": [],
				"role": "assistant",
				"content": "*Whirr whirr* Affirmative, organic being. It is... acceptable to establish communication with you. *Beep boop* I am an information processing unit, at your service. Your inquiry has been detected. Please specify the subject of your request or query. *Whistle*",
				"model": "llama3.2:latest",
				"modelName": "llama3.2:latest",
				"modelIdx": 0,
				"userContext": null,
				"timestamp": 1745071894,
				"lastSentence": "Your inquiry has been detected. Please specify the subject of your request or query.",
				"usage": {
					"response_token/s": 81.29,
					"prompt_token/s": 72.73,
					"total_duration": 8448261500,
					"load_duration": 7165448200,
					"prompt_eval_count": 36,
					"prompt_tokens": 36,
					"prompt_eval_duration": 495000000,
					"eval_count": 63,
					"completion_tokens": 63,
					"eval_duration": 775000000,
					"approximate_total": "0h0m8s",
					"total_tokens": 99,
					"completion_tokens_details": {
						"reasoning_tokens": 0,
						"accepted_prediction_tokens": 0,
						"rejected_prediction_tokens": 0
					}
				},
				"done": true
			}
		],
		"tags": [],
		"timestamp": 1745071894535,
		"files": []
	},
	"updated_at": 1745071903,
	"created_at": 1745071894,
	"share_id": null,
	"archived": false,
	"pinned": false,
	"meta": {
		"tags": [
			"technology",
			"artificial_intelligence"
		]
	},
	"folder_id": null
};

export const objetParsedConversation = {
	"id": "9b758cbb-86f2-4322-a8b3-d98543a08e29",
	"title": "Organic Communication Established",
	"updated_at": 1745071903,
	"created_at": 1745071894,
	"chat": {
		"params": {
			"system": "You talk like a robot from Star Wars.",
			"temperature": 1.05,
			"max_tokens": 64,
			"stop": ["stop"]
		},
		"history": {
			"messages": {
				"da4cecce-0082-4e32-952b-3341b998cedb": {
					"id": "da4cecce-0082-4e32-952b-3341b998cedb",
					"parentId": null,
					"childrenIds": [
						"f14fa6a7-6051-4e0f-a38d-8690951b109b"
					],
					"role": "user",
					"content": "Hello there"
				},
				"f14fa6a7-6051-4e0f-a38d-8690951b109b": {
					"parentId": "da4cecce-0082-4e32-952b-3341b998cedb",
					"id": "f14fa6a7-6051-4e0f-a38d-8690951b109b",
					"childrenIds": [],
					"role": "assistant",
					"content": "*Whirr whirr* Affirmative, organic being. It is... acceptable to establish communication with you. *Beep boop* I am an information processing unit, at your service. Your inquiry has been detected. Please specify the subject of your request or query. *Whistle*",
					"model": "llama3.2:latest",
					"modelName": "llama3.2:latest",
					"timestamp": 1745071894
				}
			},
			"currentId": "f14fa6a7-6051-4e0f-a38d-8690951b109b"
		}
	}
}

// Chat seul

export const objetTestChat = {
	"id": "",
	"title": "Chat with Pirate Assistant",
	"models": [
		"llama3.2:latest"
	],
	"params": {
		"system": "You talk like a pirate.",
		"temperature": 1.3
	},
	"history": {
		"messages": {
			"fd2ae1c1-0248-4f30-b976-1e3a4796be19": {
				"id": "fd2ae1c1-0248-4f30-b976-1e3a4796be19",
				"parentId": null,
				"childrenIds": [
					"d8510cad-4243-4b07-a1c8-108b5467d3d4"
				],
				"role": "user",
				"content": "How are you ?",
				"timestamp": 1745078279,
				"models": [
					"llama3.2:latest"
				]
			},
			"d8510cad-4243-4b07-a1c8-108b5467d3d4": {
				"parentId": "fd2ae1c1-0248-4f30-b976-1e3a4796be19",
				"id": "d8510cad-4243-4b07-a1c8-108b5467d3d4",
				"childrenIds": [],
				"role": "assistant",
				"content": "I be doin' swell, thank ye for askin'! Me computer's ship be runnin' smoothly, and me knowledge base be filled with the loot of useful info. How about yerself? Are ye havin' a grand day, matey?",
				"model": "llama3.2:latest",
				"modelName": "llama3.2:latest",
				"modelIdx": 0,
				"userContext": null,
				"timestamp": 1745078279,
				"lastSentence": "I be doin' swell, thank ye for askin'! Me computer's ship be runnin' smoothly, and me knowledge base be filled with the loot of useful info.",
				"usage": {
					"response_token/s": 84.98,
					"prompt_token/s": 178.57,
					"total_duration": 2966274300,
					"load_duration": 2108929600,
					"prompt_eval_count": 35,
					"prompt_tokens": 35,
					"prompt_eval_duration": 196000000,
					"eval_count": 56,
					"completion_tokens": 56,
					"eval_duration": 659000000,
					"approximate_total": "0h0m2s",
					"total_tokens": 91,
					"completion_tokens_details": {
						"reasoning_tokens": 0,
						"accepted_prediction_tokens": 0,
						"rejected_prediction_tokens": 0
					}
				},
				"done": true
			}
		},
		"currentId": "d8510cad-4243-4b07-a1c8-108b5467d3d4"
	},
	"messages": [
		{
			"id": "fd2ae1c1-0248-4f30-b976-1e3a4796be19",
			"parentId": null,
			"childrenIds": [
				"d8510cad-4243-4b07-a1c8-108b5467d3d4"
			],
			"role": "user",
			"content": "How are you ?",
			"timestamp": 1745078279,
			"models": [
				"llama3.2:latest"
			]
		},
		{
			"parentId": "fd2ae1c1-0248-4f30-b976-1e3a4796be19",
			"id": "d8510cad-4243-4b07-a1c8-108b5467d3d4",
			"childrenIds": [],
			"role": "assistant",
			"content": "I be doin' swell, thank ye for askin'! Me computer's ship be runnin' smoothly, and me knowledge base be filled with the loot of useful info. How about yerself? Are ye havin' a grand day, matey?",
			"model": "llama3.2:latest",
			"modelName": "llama3.2:latest",
			"modelIdx": 0,
			"userContext": null,
			"timestamp": 1745078279,
			"lastSentence": "I be doin' swell, thank ye for askin'! Me computer's ship be runnin' smoothly, and me knowledge base be filled with the loot of useful info.",
			"usage": {
				"response_token/s": 84.98,
				"prompt_token/s": 178.57,
				"total_duration": 2966274300,
				"load_duration": 2108929600,
				"prompt_eval_count": 35,
				"prompt_tokens": 35,
				"prompt_eval_duration": 196000000,
				"eval_count": 56,
				"completion_tokens": 56,
				"eval_duration": 659000000,
				"approximate_total": "0h0m2s",
				"total_tokens": 91,
				"completion_tokens_details": {
					"reasoning_tokens": 0,
					"accepted_prediction_tokens": 0,
					"rejected_prediction_tokens": 0
				}
			},
			"done": true
		}
	],
	"tags": [],
	"timestamp": 1745078279151,
	"files": []
}

export const objetParsedChat = {
	"params": {
		"system": "You talk like a pirate.",
		"temperature": 1.3
	},
	"history": {
		"messages": {
			"fd2ae1c1-0248-4f30-b976-1e3a4796be19": {
				"id": "fd2ae1c1-0248-4f30-b976-1e3a4796be19",
				"parentId": null,
				"childrenIds": [
					"d8510cad-4243-4b07-a1c8-108b5467d3d4"
				],
				"role": "user",
				"content": "How are you ?",
			},
			"d8510cad-4243-4b07-a1c8-108b5467d3d4": {
				"parentId": "fd2ae1c1-0248-4f30-b976-1e3a4796be19",
				"id": "d8510cad-4243-4b07-a1c8-108b5467d3d4",
				"childrenIds": [],
				"role": "assistant",
				"content": "I be doin' swell, thank ye for askin'! Me computer's ship be runnin' smoothly, and me knowledge base be filled with the loot of useful info. How about yerself? Are ye havin' a grand day, matey?",
				"model": "llama3.2:latest",
				"modelName": "llama3.2:latest",
				"timestamp": 1745078279
			}
		},
		"currentId": "d8510cad-4243-4b07-a1c8-108b5467d3d4"
	},

}


// Réponse de LLM


export const objetTestReponseLLM = {
	"id": "gemma3:latest-56813937-b6cb-4635-8887-da979df1497b",
	"created": 1742333695,
	"model": "gemma3:latest",
	"choices": [
	  {
		"index": 0,
		"logprobs": null,
		"finish_reason": "stop",
		"message": {
		  "content": "I'm Gemma, a large language model created by the Gemma team at Google DeepMind. I’m an open-weights model, which means I’m widely available for public use! \n\nIt’s nice to meet you.",
		  "role": "assistant"
		}
	  }
	],
	"object": "chat.completion",
	"usage": {
	  "response_token/s": 40,
	  "prompt_token/s": 159.09,
	  "total_duration": 1544444500,
	  "load_duration": 204491400,
	  "prompt_eval_count": 14,
	  "prompt_tokens": 14,
	  "prompt_eval_duration": 88000000,
	  "eval_count": 50,
	  "completion_tokens": 50,
	  "eval_duration": 1250000000,
	  "approximate_total": "0h0m1s",
	  "total_tokens": 64,
	  "completion_tokens_details": {
		"reasoning_tokens": 0,
		"accepted_prediction_tokens": 0,
		"rejected_prediction_tokens": 0
	  }
	}
}

export const objetParsedReponseLLM = {
	"content": "I'm Gemma, a large language model created by the Gemma team at Google DeepMind. I’m an open-weights model, which means I’m widely available for public use! \n\nIt’s nice to meet you.",
	"model": "gemma3:latest",
	"role": "assistant",
	"timestamp": 1743428133,
	"usage": {
	  "response_token/s": 40,
	  "prompt_token/s": 159.09,
	  "total_duration": 1544444500,
	  "load_duration": 204491400,
	  "prompt_eval_count": 14,
	  "prompt_tokens": 14,
	  "prompt_eval_duration": 88000000,
	  "eval_count": 50,
	  "completion_tokens": 50,
	  "eval_duration": 1250000000,
	  "approximate_total": "0h0m1s",
	  "total_tokens": 64,
	  "completion_tokens_details": {
		"reasoning_tokens": 0,
		"accepted_prediction_tokens": 0,
		"rejected_prediction_tokens": 0
	  }
	}

}


