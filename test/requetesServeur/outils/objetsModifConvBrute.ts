/**
 * Objets pour les tests du fichier 'modificationObjetConversationBrute.test.ts'
 */

import { MessageDemande, MessageReponse } from "@/types/dataTypes"


export const objetConvBrutePourTestAjoutEtModification: any = {
  "id": "8cca7d74-e16d-4849-b54c-444b43cd9769",
  "user_id": "1bdd1c7e-065f-47f0-b7e0-0745dd038e8d",
  "title": "Conversation test",
  "chat": {
    "id": "",
    "title": "Conversation test",
    "models": [
      "phi3:latest"
    ],
    "params": {},
    "history": {
      "messages": {
        "demande1": {
          "id": "demande1",
          "parentId": null,
          "childrenIds": [
            "reponse1"
          ],
          "role": "user",
          "content": "test demande1",
          "timestamp": 1742202929,
          "models": [
            "phi3:latest"
          ]
        },
        "reponse1": {
          "parentId": "demande1",
          "id": "reponse1",
          "childrenIds": [
            "demande2"
          ],
          "role": "assistant",
          "content": "test reponse1",
          "model": "llama3.2:latest",
          "modelName": "llama3.2:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202929,
          "usage": {
            "response_token/s": 84.77,
            "prompt_token/s": 248.32,
            "total_duration": 7081262500,
            "load_duration": 3567655400,
            "prompt_eval_count": 37,
            "prompt_tokens": 37,
            "prompt_eval_duration": 149000000,
            "eval_count": 285,
            "completion_tokens": 285,
            "eval_duration": 3362000000,
            "approximate_total": "0h0m7s",
            "total_tokens": 322,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
        "demande2": {
          "id": "demande2",
          "parentId": "reponse1",
          "childrenIds": [
            "reponse2", "reponse3"
          ],
          "role": "user",
          "content": "test demande2",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
        "reponse2": {
          "parentId": "demande2",
          "id": "reponse2",
          "childrenIds": [ 
			"demande3"
		  ],
          "role": "assistant",
          "content": "test reponse2",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
		"reponse3": {
          "parentId": "demande2",
          "id": "reponse3",
          "childrenIds": [
			
		  ],
          "role": "assistant",
          "content": "test reponse3",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
		"demande3": {
          "id": "demande3",
          "parentId": "reponse2",
          "childrenIds": [
            
          ],
          "role": "user",
          "content": "test demande3",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        }
	  },
      "currentId": "reponse3"
    },
    "messages": [
        {
          "id": "demande1",
          "parentId": null,
          "childrenIds": [
            "reponse1"
          ],
          "role": "user",
          "content": "test demande1",
          "timestamp": 1742202929,
          "models": [
            "phi3:latest"
          ]
        },
        {
          "parentId": "demande1",
          "id": "reponse1",
          "childrenIds": [
            "demande2"
          ],
          "role": "assistant",
          "content": "test reponse1",
          "model": "llama3.2:latest",
          "modelName": "llama3.2:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202929,
          "usage": {
            "response_token/s": 84.77,
            "prompt_token/s": 248.32,
            "total_duration": 7081262500,
            "load_duration": 3567655400,
            "prompt_eval_count": 37,
            "prompt_tokens": 37,
            "prompt_eval_duration": 149000000,
            "eval_count": 285,
            "completion_tokens": 285,
            "eval_duration": 3362000000,
            "approximate_total": "0h0m7s",
            "total_tokens": 322,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
        {
          "id": "demande2",
          "parentId": "reponse1",
          "childrenIds": [
            "reponse2", "reponse3"
          ],
          "role": "user",
          "content": "test demande2",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
        {
          "parentId": "demande2",
          "id": "reponse3",
          "childrenIds": [
			
		  ],
          "role": "assistant",
          "content": "test reponse3",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
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
    "timestamp": 1742202929043,
    "files": []
  },
  "updated_at": 1742207471,
  "created_at": 1742202929,
  "share_id": null,
  "archived": false,
  "pinned": false,
  "meta": {
    "tags": [
      "science",
      "astrophysique"
    ]
  },
  "folder_id": null
}

/*
  Structure de la conversation ci-dessus :

                   demande1
                      |
                   reponse1
                      |
                   demande2
                  /        \
            reponse2       reponse3
               |         
            demande3   
                        
    Avec 'demande3' en dernier message affiché (c'est l'attribut 'chat.history.currentId')
*/

export const messageDemande: MessageDemande = {
  id: "demande10",
  parentId: null,
  childrenIds: [],
  role: "user",
  content: "test demande10"
}

export const messageReponse: MessageReponse = {
  id: "reponse10",
  parentId: null,
  childrenIds: [],
  role: "assistant",
  content: "test reponse10",
  model: "phi3:latest",
  modelName: "phi3:latest"
}

export const objetConvBrutePourTestAjoutApresAjoutMessagesDemandeEtReponse: any = {
  "id": "8cca7d74-e16d-4849-b54c-444b43cd9769",
  "user_id": "1bdd1c7e-065f-47f0-b7e0-0745dd038e8d",
  "title": "Conversation test",
  "chat": {
    "id": "",
    "title": "Conversation test",
    "models": [
      "phi3:latest"
    ],
    "params": {},
    "history": {
      "messages": {
        "demande1": {
          "id": "demande1",
          "parentId": null,
          "childrenIds": [
            "reponse1"
          ],
          "role": "user",
          "content": "test demande1",
          "timestamp": 1742202929,
          "models": [
            "phi3:latest"
          ]
        },
        "reponse1": {
          "parentId": "demande1",
          "id": "reponse1",
          "childrenIds": [
            "demande2"
          ],
          "role": "assistant",
          "content": "test reponse1",
          "model": "llama3.2:latest",
          "modelName": "llama3.2:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202929,
          "usage": {
            "response_token/s": 84.77,
            "prompt_token/s": 248.32,
            "total_duration": 7081262500,
            "load_duration": 3567655400,
            "prompt_eval_count": 37,
            "prompt_tokens": 37,
            "prompt_eval_duration": 149000000,
            "eval_count": 285,
            "completion_tokens": 285,
            "eval_duration": 3362000000,
            "approximate_total": "0h0m7s",
            "total_tokens": 322,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
        "demande2": {
          "id": "demande2",
          "parentId": "reponse1",
          "childrenIds": [
            "reponse2", "reponse3"
          ],
          "role": "user",
          "content": "test demande2",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
        "reponse2": {
          "parentId": "demande2",
          "id": "reponse2",
          "childrenIds": [ 
			"demande3"
		  ],
          "role": "assistant",
          "content": "test reponse2",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
		"reponse3": {
          "parentId": "demande2",
          "id": "reponse3",
          "childrenIds": [
            "demande10"
		  ],
          "role": "assistant",
          "content": "test reponse3",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
		"demande3": {
          "id": "demande3",
          "parentId": "reponse2",
          "childrenIds": [
            
          ],
          "role": "user",
          "content": "test demande3",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
		"demande10": {
          "id": "demande10",
          "parentId": "reponse3",
          "childrenIds": [
            "reponse10"
          ],
          "role": "user",
          "content": "test demande10",
        },
		"reponse10": {
          "parentId": "demande10",
          "id": "reponse10",
          "childrenIds": [
			
		  ],
          "role": "assistant",
          "content": "test reponse10",
          "model": "phi3:latest",
          "modelName": "phi3:latest"
        }
	  },
      "currentId": "reponse10"
    },
    "messages": [
        {
          "id": "demande1",
          "parentId": null,
          "childrenIds": [
            "reponse1"
          ],
          "role": "user",
          "content": "test demande1",
          "timestamp": 1742202929,
          "models": [
            "phi3:latest"
          ]
        },
        {
          "parentId": "demande1",
          "id": "reponse1",
          "childrenIds": [
            "demande2"
          ],
          "role": "assistant",
          "content": "test reponse1",
          "model": "llama3.2:latest",
          "modelName": "llama3.2:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202929,
          "usage": {
            "response_token/s": 84.77,
            "prompt_token/s": 248.32,
            "total_duration": 7081262500,
            "load_duration": 3567655400,
            "prompt_eval_count": 37,
            "prompt_tokens": 37,
            "prompt_eval_duration": 149000000,
            "eval_count": 285,
            "completion_tokens": 285,
            "eval_duration": 3362000000,
            "approximate_total": "0h0m7s",
            "total_tokens": 322,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
        {
          "id": "demande2",
          "parentId": "reponse1",
          "childrenIds": [
            "reponse2", "reponse3"
          ],
          "role": "user",
          "content": "test demande2",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
		{
          "parentId": "demande2",
          "id": "reponse3",
          "childrenIds": [
            "demande10"
		  ],
          "role": "assistant",
          "content": "test reponse3",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
		{
          "id": "demande10",
          "parentId": "reponse3",
          "childrenIds": [
            "reponse10"
          ],
          "role": "user",
          "content": "test demande10"
        },
		{
          "parentId": "demande10",
          "id": "reponse10",
          "childrenIds": [
			
		  ],
          "role": "assistant",
          "content": "test reponse10",
          "model": "phi3:latest",
          "modelName": "phi3:latest"
        }
    ],
    "tags": [],
    "timestamp": 1742202929043,
    "files": []
  },
  "updated_at": 1742207471,
  "created_at": 1742202929,
  "share_id": null,
  "archived": false,
  "pinned": false,
  "meta": {
    "tags": [
      "science",
      "astrophysique"
    ]
  },
  "folder_id": null
}

/*
  Structure de la conversation ci-dessus :

                   demande1
                      |
                   reponse1
                      |
                   demande2
                  /        \
            reponse2       reponse3
               |              |
            demande3       demande10
                              |
                           reponse10
                        
    Avec 'demande10' en dernier message affiché (c'est l'attribut 'chat.history.currentId')
*/








export const objetConvBrutePourTestSuppression: any = {
    "id": "8cca7d74-e16d-4849-b54c-444b43cd9769",
    "user_id": "1bdd1c7e-065f-47f0-b7e0-0745dd038e8d",
    "title": "Conversation test",
    "chat": {
      "id": "",
      "title": "Conversation test",
      "models": [
        "phi3:latest"
      ],
      "params": {},
      "history": {
        "messages": {
          "demande1": {
            "id": "demande1",
            "parentId": null,
            "childrenIds": [
              "reponse1"
            ],
            "role": "user",
            "content": "test demande1",
            "timestamp": 1742202929,
            "models": [
              "phi3:latest"
            ]
          },
          "reponse1": {
            "parentId": "demande1",
            "id": "reponse1",
            "childrenIds": [
              "demande2"
            ],
            "role": "assistant",
            "content": "test reponse1",
            "model": "llama3.2:latest",
            "modelName": "llama3.2:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202929,
            "usage": {
              "response_token/s": 84.77,
              "prompt_token/s": 248.32,
              "total_duration": 7081262500,
              "load_duration": 3567655400,
              "prompt_eval_count": 37,
              "prompt_tokens": 37,
              "prompt_eval_duration": 149000000,
              "eval_count": 285,
              "completion_tokens": 285,
              "eval_duration": 3362000000,
              "approximate_total": "0h0m7s",
              "total_tokens": 322,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          "demande2": {
            "id": "demande2",
            "parentId": "reponse1",
            "childrenIds": [
              "reponse2", "reponse3"
            ],
            "role": "user",
            "content": "test demande2",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          "reponse2": {
            "parentId": "demande2",
            "id": "reponse2",
            "childrenIds": [ 
              "demande3"
            ],
            "role": "assistant",
            "content": "test reponse2",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          "reponse3": {
            "parentId": "demande2",
            "id": "reponse3",
            "childrenIds": [
                  "demande4", "demande5"
            ],
            "role": "assistant",
            "content": "test reponse3",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          "demande3": {
            "id": "demande3",
            "parentId": "reponse2",
            "childrenIds": [
              
            ],
            "role": "user",
            "content": "test demande3",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          "demande4": {
            "id": "demande4",
            "parentId": "reponse3",
            "childrenIds": [
              "reponse4"
            ],
            "role": "user",
            "content": "test demande4",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          "reponse4": {
            "parentId": "demande4",
            "id": "reponse4",
            "childrenIds": [
              
            ],
            "role": "assistant",
            "content": "test reponse4",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          "demande5": {
            "id": "demande5",
            "parentId": "reponse3",
            "childrenIds": [
              "reponse5", "reponse6"
            ],
            "role": "user",
            "content": "test demande5",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          "reponse5": {
            "parentId": "demande5",
            "id": "reponse5",
            "childrenIds": [
              
            ],
            "role": "assistant",
            "content": "test reponse5",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          "reponse6": {
            "parentId": "demande5",
            "id": "reponse6",
            "childrenIds": [
              
            ],
            "role": "assistant",
            "content": "test reponse6",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          }
          
          
          
        },
        "currentId": "reponse6"
      },
      "messages": [
          {
            "id": "demande1",
            "parentId": null,
            "childrenIds": [
              "reponse1"
            ],
            "role": "user",
            "content": "test demande1",
            "timestamp": 1742202929,
            "models": [
              "phi3:latest"
            ]
          },
          {
            "parentId": "demande1",
            "id": "reponse1",
            "childrenIds": [
              "demande2"
            ],
            "role": "assistant",
            "content": "test reponse1",
            "model": "llama3.2:latest",
            "modelName": "llama3.2:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202929,
            "usage": {
              "response_token/s": 84.77,
              "prompt_token/s": 248.32,
              "total_duration": 7081262500,
              "load_duration": 3567655400,
              "prompt_eval_count": 37,
              "prompt_tokens": 37,
              "prompt_eval_duration": 149000000,
              "eval_count": 285,
              "completion_tokens": 285,
              "eval_duration": 3362000000,
              "approximate_total": "0h0m7s",
              "total_tokens": 322,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          {
            "id": "demande2",
            "parentId": "reponse1",
            "childrenIds": [
              "reponse2", "reponse3"
            ],
            "role": "user",
            "content": "test demande2",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          {
            "parentId": "demande2",
            "id": "reponse3",
            "childrenIds": [
                  "demande4", "demande5"
            ],
            "role": "assistant",
            "content": "test reponse3",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          {
            "id": "demande5",
            "parentId": "reponse3",
            "childrenIds": [
              "reponse5", "reponse6"
            ],
            "role": "user",
            "content": "test demande5",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          {
            "parentId": "demande5",
            "id": "reponse6",
            "childrenIds": [
              
            ],
            "role": "assistant",
            "content": "test reponse6",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
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
      "timestamp": 1742202929043,
      "files": []
    },
    "updated_at": 1742207471,
    "created_at": 1742202929,
    "share_id": null,
    "archived": false,
    "pinned": false,
    "meta": {
      "tags": [
        "science",
        "astrophysique"
      ]
    },
    "folder_id": null
  }

/*
  Structure de la conversation ci-dessus :

                   demande1
                      |
                   reponse1
                      |
                   demande2
                  /        \
            reponse2       reponse3
               |           |        \
            demande3    demande4     demande5
                           |           |     \
                        reponse4   reponse5   reponse6  
                        
    Avec 'reponse6' en dernier message affiché (c'est l'attribut 'chat.history.currentId')
*/

export const objetConvBrutePourTestSuppressionDemande5 = {
  "id": "8cca7d74-e16d-4849-b54c-444b43cd9769",
  "user_id": "1bdd1c7e-065f-47f0-b7e0-0745dd038e8d",
  "title": "Conversation test",
  "chat": {
    "id": "",
    "title": "Conversation test",
    "models": [
      "phi3:latest"
    ],
    "params": {},
    "history": {
      "messages": {
        "demande1": {
          "id": "demande1",
          "parentId": null,
          "childrenIds": [
            "reponse1"
          ],
          "role": "user",
          "content": "test demande1",
          "timestamp": 1742202929,
          "models": [
            "phi3:latest"
          ]
        },
        "reponse1": {
          "parentId": "demande1",
          "id": "reponse1",
          "childrenIds": [
            "demande2"
          ],
          "role": "assistant",
          "content": "test reponse1",
          "model": "llama3.2:latest",
          "modelName": "llama3.2:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202929,
          "usage": {
            "response_token/s": 84.77,
            "prompt_token/s": 248.32,
            "total_duration": 7081262500,
            "load_duration": 3567655400,
            "prompt_eval_count": 37,
            "prompt_tokens": 37,
            "prompt_eval_duration": 149000000,
            "eval_count": 285,
            "completion_tokens": 285,
            "eval_duration": 3362000000,
            "approximate_total": "0h0m7s",
            "total_tokens": 322,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
        "demande2": {
          "id": "demande2",
          "parentId": "reponse1",
          "childrenIds": [
            "reponse2", "reponse3"
          ],
          "role": "user",
          "content": "test demande2",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
        "reponse2": {
          "parentId": "demande2",
          "id": "reponse2",
          "childrenIds": [ 
			"demande3"
		  ],
          "role": "assistant",
          "content": "test reponse2",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
		"reponse3": {
          "parentId": "demande2",
          "id": "reponse3",
          "childrenIds": [
			"demande4"
		  ],
          "role": "assistant",
          "content": "test reponse3",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
		"demande3": {
          "id": "demande3",
          "parentId": "reponse2",
          "childrenIds": [
            
          ],
          "role": "user",
          "content": "test demande3",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
		"demande4": {
          "id": "demande4",
          "parentId": "reponse3",
          "childrenIds": [
            "reponse4"
          ],
          "role": "user",
          "content": "test demande4",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
		"reponse4": {
          "parentId": "demande4",
          "id": "reponse4",
          "childrenIds": [
			
		  ],
          "role": "assistant",
          "content": "test reponse4",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        }
		
      },
      "currentId": "reponse4"
    },
    "messages": [
        {
          "id": "demande1",
          "parentId": null,
          "childrenIds": [
            "reponse1"
          ],
          "role": "user",
          "content": "test demande1",
          "timestamp": 1742202929,
          "models": [
            "phi3:latest"
          ]
        },
        {
          "parentId": "demande1",
          "id": "reponse1",
          "childrenIds": [
            "demande2"
          ],
          "role": "assistant",
          "content": "test reponse1",
          "model": "llama3.2:latest",
          "modelName": "llama3.2:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202929,
          "usage": {
            "response_token/s": 84.77,
            "prompt_token/s": 248.32,
            "total_duration": 7081262500,
            "load_duration": 3567655400,
            "prompt_eval_count": 37,
            "prompt_tokens": 37,
            "prompt_eval_duration": 149000000,
            "eval_count": 285,
            "completion_tokens": 285,
            "eval_duration": 3362000000,
            "approximate_total": "0h0m7s",
            "total_tokens": 322,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
        {
          "id": "demande2",
          "parentId": "reponse1",
          "childrenIds": [
            "reponse2", "reponse3"
          ],
          "role": "user",
          "content": "test demande2",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
		{
          "parentId": "demande2",
          "id": "reponse3",
          "childrenIds": [
			"demande4"
		  ],
          "role": "assistant",
          "content": "test reponse3",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "done": true
        },
		{
          "id": "demande4",
          "parentId": "reponse3",
          "childrenIds": [
            "reponse4"
          ],
          "role": "user",
          "content": "test demande4",
          "timestamp": 1742202963,
          "models": [
            "phi3:latest"
          ]
        },
		{
          "parentId": "demande4",
          "id": "reponse4",
          "childrenIds": [
			
		  ],
          "role": "assistant",
          "content": "test reponse4",
          "model": "phi3:latest",
          "modelName": "phi3:latest",
          "modelIdx": 0,
          "userContext": null,
          "timestamp": 1742202963,
          "usage": {
            "response_token/s": 80.43,
            "prompt_token/s": 1332,
            "total_duration": 5726875000,
            "load_duration": 3148920200,
            "prompt_eval_count": 333,
            "prompt_tokens": 333,
            "prompt_eval_duration": 250000000,
            "eval_count": 187,
            "completion_tokens": 187,
            "eval_duration": 2325000000,
            "approximate_total": "0h0m5s",
            "total_tokens": 520,
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
    "timestamp": 1742202929043,
    "files": []
  },
  "updated_at": 1742207471,
  "created_at": 1742202929,
  "share_id": null,
  "archived": false,
  "pinned": false,
  "meta": {
    "tags": [
      "science",
      "astrophysique"
    ]
  },
  "folder_id": null
}

/*
  Structure de la conversation ci-dessus :

                   demande1
                      |
                   reponse1
                      |
                   demande2
                  /        \
            reponse2       reponse3
               |              | 
            demande3       demande4     
                              |          
                           reponse4  
                        
    Avec 'reponse4' en dernier message affiché (c'est l'attribut 'chat.history.currentId')
    -> suppression de 'demande5' et de ses enfants 'reponse5' et 'reponse6'

*/


export const objetConvBrutePourTestSuppressionDemande2 = {
    "id": "8cca7d74-e16d-4849-b54c-444b43cd9769",
    "user_id": "1bdd1c7e-065f-47f0-b7e0-0745dd038e8d",
    "title": "Conversation test",
    "chat": {
      "id": "",
      "title": "Conversation test",
      "models": [
        "phi3:latest"
      ],
      "params": {},
      "history": {
        "messages": {
          "demande1": {
            "id": "demande1",
            "parentId": null,
            "childrenIds": [
              "reponse1"
            ],
            "role": "user",
            "content": "test demande1",
            "timestamp": 1742202929,
            "models": [
              "phi3:latest"
            ]
          },
          "reponse1": {
            "parentId": "demande1",
            "id": "reponse1",
            "childrenIds": [
              "demande3", "demande4", "demande5"
            ],
            "role": "assistant",
            "content": "test reponse1",
            "model": "llama3.2:latest",
            "modelName": "llama3.2:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202929,
            "usage": {
              "response_token/s": 84.77,
              "prompt_token/s": 248.32,
              "total_duration": 7081262500,
              "load_duration": 3567655400,
              "prompt_eval_count": 37,
              "prompt_tokens": 37,
              "prompt_eval_duration": 149000000,
              "eval_count": 285,
              "completion_tokens": 285,
              "eval_duration": 3362000000,
              "approximate_total": "0h0m7s",
              "total_tokens": 322,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          "demande3": {
            "id": "demande3",
            "parentId": "reponse1",
            "childrenIds": [
              
            ],
            "role": "user",
            "content": "test demande3",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          "demande4": {
            "id": "demande4",
            "parentId": "reponse1",
            "childrenIds": [
              "reponse4"
            ],
            "role": "user",
            "content": "test demande4",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          "reponse4": {
            "parentId": "demande4",
            "id": "reponse4",
            "childrenIds": [
              
            ],
            "role": "assistant",
            "content": "test reponse4",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          "demande5": {
            "id": "demande5",
            "parentId": "reponse1",
            "childrenIds": [
              "reponse5", "reponse6"
            ],
            "role": "user",
            "content": "test demande5",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          "reponse5": {
            "parentId": "demande5",
            "id": "reponse5",
            "childrenIds": [
              
            ],
            "role": "assistant",
            "content": "test reponse5",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          "reponse6": {
            "parentId": "demande5",
            "id": "reponse6",
            "childrenIds": [
              
            ],
            "role": "assistant",
            "content": "test reponse6",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          }
          
          
          
        },
        "currentId": "reponse6"
      },
      "messages": [
          {
            "id": "demande1",
            "parentId": null,
            "childrenIds": [
              "reponse1"
            ],
            "role": "user",
            "content": "test demande1",
            "timestamp": 1742202929,
            "models": [
              "phi3:latest"
            ]
          },
          {
            "parentId": "demande1",
            "id": "reponse1",
            "childrenIds": [
              "demande3", "demande4", "demande5"
            ],
            "role": "assistant",
            "content": "test reponse1",
            "model": "llama3.2:latest",
            "modelName": "llama3.2:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202929,
            "usage": {
              "response_token/s": 84.77,
              "prompt_token/s": 248.32,
              "total_duration": 7081262500,
              "load_duration": 3567655400,
              "prompt_eval_count": 37,
              "prompt_tokens": 37,
              "prompt_eval_duration": 149000000,
              "eval_count": 285,
              "completion_tokens": 285,
              "eval_duration": 3362000000,
              "approximate_total": "0h0m7s",
              "total_tokens": 322,
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "done": true
          },
          {
            "id": "demande5",
            "parentId": "reponse1",
            "childrenIds": [
              "reponse5", "reponse6"
            ],
            "role": "user",
            "content": "test demande5",
            "timestamp": 1742202963,
            "models": [
              "phi3:latest"
            ]
          },
          {
            "parentId": "demande5",
            "id": "reponse6",
            "childrenIds": [
              
            ],
            "role": "assistant",
            "content": "test reponse6",
            "model": "phi3:latest",
            "modelName": "phi3:latest",
            "modelIdx": 0,
            "userContext": null,
            "timestamp": 1742202963,
            "usage": {
              "response_token/s": 80.43,
              "prompt_token/s": 1332,
              "total_duration": 5726875000,
              "load_duration": 3148920200,
              "prompt_eval_count": 333,
              "prompt_tokens": 333,
              "prompt_eval_duration": 250000000,
              "eval_count": 187,
              "completion_tokens": 187,
              "eval_duration": 2325000000,
              "approximate_total": "0h0m5s",
              "total_tokens": 520,
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
      "timestamp": 1742202929043,
      "files": []
    },
    "updated_at": 1742207471,
    "created_at": 1742202929,
    "share_id": null,
    "archived": false,
    "pinned": false,
    "meta": {
      "tags": [
        "science",
        "astrophysique"
      ]
    },
    "folder_id": null
  }

/*
  Structure de la conversation ci-dessus, après suppression du message 'demande2' :

                   demande1
                      |
                   reponse1
                 /    |     \
                /     |      \
        demande3   demande4   demande5
                      |         |     \
                   reponse4  reponse5  reponse6  
                        
    Avec 'reponse6' en dernier message affiché (c'est l'attribut 'chat.history.currentId')
    -> suppression de 'demande2' et de ses enfants 'reponse3' et 'reponse4'
    -> le parent de 'demande2' ('reponse1') et les petits-enfants de 'demande2' ('demande3', 'demande4' et 'demande5') sont reliés
*/