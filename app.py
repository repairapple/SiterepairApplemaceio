from flask import Flask, request, jsonify, send_from_directory, session, redirect, url_for, render_template_string
import os
import json
from datetime import datetime

# Set the static folder to current directory
app = Flask(__name__, static_folder='.')
app.secret_key = 'sua_chave_secreta_aqui' # Chave para gerenciar sessões

# Configuração de Login
ADMIN_USER = "admin"
ADMIN_PASS = "admin"

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] == ADMIN_USER and request.form['password'] == ADMIN_PASS:
            session['logged_in'] = True
            return redirect(url_for('view_messages'))
        else:
            error = 'Credenciais inválidas. Tente novamente.'
            
    # Template de Login simples
    return render_template_string('''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login Admin</title>
        <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f2f5; margin: 0; }
            .login-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 300px; }
            h2 { text-align: center; color: #333; margin-top: 0; }
            input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            button { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
            button:hover { background-color: #0056b3; }
            .error { color: red; font-size: 14px; text-align: center; margin-bottom: 10px; }
            .back-link { display: block; text-align: center; margin-top: 15px; font-size: 14px; text-decoration: none; color: #666; }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>Área Restrita</h2>
            {% if error %}
                <div class="error">{{ error }}</div>
            {% endif %}
            <form method="post">
                <input type="text" name="username" placeholder="Usuário" required>
                <input type="password" name="password" placeholder="Senha" required>
                <button type="submit">Entrar</button>
            </form>
            <a href="/" class="back-link">Voltar para o site</a>
        </div>
    </body>
    </html>
    ''', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    
    # Simple validation
    if not data or not all(k in data for k in ('name', 'email', 'message')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Save to file (simulating database/email)
    message_entry = {
        'id': datetime.now().strftime('%Y%m%d%H%M%S'),
        'timestamp': datetime.now().isoformat(),
        'data': data
    }
    
    try:
        messages_file = 'messages.json'
        messages = []
        
        if os.path.exists(messages_file):
            with open(messages_file, 'r', encoding='utf-8') as f:
                try:
                    messages = json.load(f)
                except json.JSONDecodeError:
                    messages = []
            
        messages.append(message_entry)
        
        with open(messages_file, 'w', encoding='utf-8') as f:
            json.dump(messages, f, indent=2, ensure_ascii=False)
            
        return jsonify({'message': 'Mensagem recebida com sucesso! Entraremos em contato em breve.'})
    except Exception as e:
        print(f"Error saving message: {e}")
        return jsonify({'error': 'Erro interno ao salvar mensagem'}), 500

@app.route('/admin/messages')
def view_messages():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
        
    messages = []
    messages_file = 'messages.json'
    if os.path.exists(messages_file):
        with open(messages_file, 'r', encoding='utf-8') as f:
            try:
                messages = json.load(f)
            except:
                messages = []
    
    # Sort by newest first
    messages.sort(key=lambda x: x['timestamp'], reverse=True)
    
    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Mensagens Recebidas</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .message-card { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .meta { color: #666; font-size: 0.9em; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .field { margin: 5px 0; }
            .label { font-weight: bold; color: #333; }
            .content { background: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 10px; }
            .logout-btn { padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; }
            .logout-btn:hover { background-color: #c82333; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Mensagens do Site</h1>
            <a href="/logout" class="logout-btn">Sair</a>
        </div>
        {% for msg in messages %}
        <div class="message-card">
            <div class="meta">Recebido em: {{ msg.timestamp }} | ID: {{ msg.id }}</div>
            <div class="field"><span class="label">Nome:</span> {{ msg.data.name }}</div>
            <div class="field"><span class="label">Email:</span> {{ msg.data.email }}</div>
            <div class="field"><span class="label">Telefone:</span> {{ msg.data.phone }}</div>
            <div class="field"><span class="label">Serviço:</span> {{ msg.data.service }}</div>
            <div class="field"><span class="label">Mensagem:</span></div>
            <div class="content">{{ msg.data.message }}</div>
        </div>
        {% else %}
        <p>Nenhuma mensagem recebida ainda.</p>
        {% endfor %}
    </body>
    </html>
    '''
    return render_template_string(html, messages=messages)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
