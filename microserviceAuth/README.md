# Authentication Microservice

Welcome to the Authentication Microservice! 🚀

## Getting Started

Follow these steps to get the authentication service up and running:

### Prerequisites

Make sure you have the following installed:

- [Python](https://www.python.org/) (version 3.8 or higher)
- [pip](https://pip.pypa.io/en/stable/) (Python package installer)

### Installation

1. Activate the virtual environment:

   ```bash
   venv\Scripts\activate
   ```

2. Install the dependencies:
   ```bash
    pip install -r requirements.txt
   ```

### Configuration ⚙️

1. Create a `.env` file in the root directory and add the necessary environment variables. For `client_id` and `client_secret`, you need to use the keys obtained from the Google Developer Console:
   ```plaintext
   CLIENT_ID = "your_client_id"
   CLIENT_SECRET = "your_client_secret"
   SECRET_KEY = "your_secret_key"
   ```

### Running the Service

1. Start the service:

   ```bash
    uvicorn main:app --reload
   ```

2. The service should now be running on `http://localhost:8000`.
