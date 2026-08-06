from flask import Flask, request, jsonify, send_from_directory, session, redirect, url_for, render_template_string
import os
import json
from datetime import datetime
from functools import wraps

# Set the static folder to parent directory (local: SiteRepair/SiterepairApplemaceio/) or current dir (Render)
import sys
if os.environ.get('RENDER') or 'gunicorn' in sys.modules or not os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'index.html')):
    app = Flask(__name__, static_folder='../')
else:
    app = Flask(__name__, static_folder='../')

# CORS: allow cross-origin requests (GitHub Pages -> Render)
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

# On Render, serve static files from the repo root as well
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
if not os.path.exists(os.path.join(STATIC_DIR, 'index.html')):
    STATIC_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app.secret_key = os.environ.get('SECRET_KEY', 'segredo_muito_seguro')

# --- Authentication Decorator ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

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
            
    # Template de Login Profissional
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Painel Admin &mdash; Repair Apple Maceió</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #0a0a0a;
                --surface: #141414;
                --surface-hover: #1c1c1c;
                --border: #2a2a2a;
                --text: #ffffff;
                --text-secondary: #a0a0a0;
                --accent: #ffffff;
                --accent-dim: #cccccc;
                --danger-bg: rgba(220, 53, 69, 0.12);
                --danger-text: #ff6b6b;
                --danger-border: rgba(220, 53, 69, 0.25);
                --input-bg: #0d0d0d;
                --radius-sm: 8px;
                --radius-md: 12px;
                --radius-lg: 16px;
                --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: var(--bg);
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                color: var(--text);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background-image:
                    radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%),
                    radial-gradient(ellipse at 80% 100%, rgba(255,255,255,0.02) 0%, transparent 60%);
            }

            .login-wrapper {
                width: 100%;
                max-width: 420px;
                padding: 24px;
            }

            .login-card {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: var(--radius-lg);
                padding: 40px 36px;
                box-shadow:
                    0 1px 2px rgba(0,0,0,0.4),
                    0 4px 24px rgba(0,0,0,0.5),
                    0 0 0 1px rgba(255,255,255,0.03) inset;
            }

            .brand {
                text-align: center;
                margin-bottom: 32px;
            }

            .brand-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 8px;
            }

            .brand-logo svg {
                width: 32px;
                height: 38px;
                flex-shrink: 0;
            }

            .brand-name {
                text-align: left;
                line-height: 1.05;
            }

            .brand-name .line1 {
                font-size: 15px;
                font-weight: 700;
                letter-spacing: 0.06em;
                color: var(--text);
                display: block;
            }

            .brand-name .line2 {
                font-size: 17px;
                font-weight: 900;
                letter-spacing: 0.08em;
                color: var(--text);
                display: block;
            }

            .brand-divider {
                width: 40px;
                height: 2px;
                background: var(--text);
                margin: 14px auto 0;
                border-radius: 1px;
                opacity: 0.3;
            }

            .login-card h2 {
                text-align: center;
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--text-secondary);
                margin-bottom: 28px;
            }

            .input-group {
                margin-bottom: 18px;
            }

            .input-group label {
                display: block;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: var(--text-secondary);
                margin-bottom: 7px;
            }

            .input-group input {
                width: 100%;
                padding: 13px 16px;
                background: var(--input-bg);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                color: var(--text);
                font-family: 'Inter', sans-serif;
                font-size: 15px;
                font-weight: 400;
                transition: border-color var(--transition), box-shadow var(--transition);
                outline: none;
            }

            .input-group input::placeholder {
                color: #555;
                font-weight: 400;
            }

            .input-group input:focus {
                border-color: #555;
                box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
            }

            .btn-login {
                width: 100%;
                padding: 14px;
                background: var(--text);
                color: #0a0a0a;
                border: none;
                border-radius: var(--radius-sm);
                font-family: 'Inter', sans-serif;
                font-size: 15px;
                font-weight: 700;
                letter-spacing: 0.03em;
                cursor: pointer;
                transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
                margin-top: 6px;
            }

            .btn-login:hover {
                background: var(--accent-dim);
                transform: translateY(-1px);
                box-shadow: 0 6px 24px rgba(255,255,255,0.08);
            }

            .btn-login:active {
                transform: translateY(0);
            }

            .error-box {
                background: var(--danger-bg);
                border: 1px solid var(--danger-border);
                color: var(--danger-text);
                padding: 12px 16px;
                border-radius: var(--radius-sm);
                font-size: 13px;
                font-weight: 500;
                text-align: center;
                margin-bottom: 18px;
                display: flex;
                align-items: center;
                gap: 8px;
                justify-content: center;
            }

            .error-box svg { flex-shrink: 0; }

            .back-link {
                display: block;
                text-align: center;
                margin-top: 20px;
                font-size: 13px;
                font-weight: 500;
                color: var(--text-secondary);
                text-decoration: none;
                transition: color var(--transition);
                letter-spacing: 0.02em;
            }

            .back-link:hover {
                color: var(--text);
            }

            .footer-note {
                text-align: center;
                margin-top: 24px;
                font-size: 11px;
                color: #444;
                letter-spacing: 0.03em;
            }

            @media (max-width: 480px) {
                .login-card {
                    padding: 32px 24px;
                    border-radius: var(--radius-md);
                }
            }
        </style>
    </head>
    <body>
        <div class="login-wrapper">
            <div class="login-card">
                <div class="brand">
                    <div class="brand-logo">
                        <svg viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" fill="#ffffff"/>
                        </svg>
                        <div class="brand-name">
                            <span class="line1">REPAIR APPLE</span>
                            <span class="line2">MACEIÓ</span>
                        </div>
                    </div>
                    <div class="brand-divider"></div>
                </div>

                <h2>Painel Administrativo</h2>

                {% if error %}
                <div class="error-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {{ error }}
                </div>
                {% endif %}

                <form method="post">
                    <div class="input-group">
                        <label for="username">Usuário</label>
                        <input type="text" id="username" name="username" placeholder="Digite seu usuário" required autofocus>
                    </div>
                    <div class="input-group">
                        <label for="password">Senha</label>
                        <input type="password" id="password" name="password" placeholder="Digite sua senha" required>
                    </div>
                    <button type="submit" class="btn-login">Entrar</button>
                </form>

                <a href="/" class="back-link">&larr; Voltar para o site</a>
            </div>
            <p class="footer-note">Repair Apple Maceió &copy; 2026 &mdash; Todos os direitos reservados.</p>
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
    return send_from_directory('../', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../', path)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    print(f"DEBUG: Received contact request: {data}")
    
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
        messages_file = os.path.abspath('messages.json')
        print(f"DEBUG: Writing to file: {messages_file}")
        
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

@app.route('/api/orders', methods=['POST'])
def save_order():
    data = request.json
    print(f"DEBUG: Received order: {data}")

    if not data or 'customer' not in data or 'items' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    order_entry = {
        'id': data.get('orderNumber', datetime.now().strftime('%Y%m%d%H%M%S')),
        'type': 'order',
        'timestamp': datetime.now().isoformat(),
        'customer': data['customer'],
        'items': data['items'],
        'total': data.get('total', 0),
        'payment': data.get('payment', 'N/A'),
        'status': 'pending'
    }

    try:
        messages_file = os.path.abspath('messages.json')
        messages = []

        if os.path.exists(messages_file):
            with open(messages_file, 'r', encoding='utf-8') as f:
                try:
                    messages = json.load(f)
                except json.JSONDecodeError:
                    messages = []

        messages.append(order_entry)

        with open(messages_file, 'w', encoding='utf-8') as f:
            json.dump(messages, f, indent=2, ensure_ascii=False)

        return jsonify({'message': 'Pedido registrado com sucesso!', 'orderNumber': order_entry['id']})
    except Exception as e:
        print(f"Error saving order: {e}")
        return jsonify({'error': 'Erro interno ao salvar pedido'}), 500

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

    # Load customer registrations
    registrations = []
    reg_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'registrations.json')
    if os.path.exists(reg_file):
        with open(reg_file, 'r', encoding='utf-8') as f:
            try:
                registrations = json.load(f)
            except:
                registrations = []
    registrations.sort(key=lambda x: x['timestamp'], reverse=True)
    
    html = '''
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Painel Admin &mdash; Repair Apple Maceió</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #0a0a0a;
                --surface: #141414;
                --surface-hover: #1c1c1c;
                --border: #2a2a2a;
                --text: #ffffff;
                --text-secondary: #a0a0a0;
                --text-tertiary: #666;
                --accent: #ffffff;
                --accent-dim: #cccccc;
                --green: #00b894;
                --green-bg: rgba(0, 184, 148, 0.12);
                --green-border: rgba(0, 184, 148, 0.25);
                --blue: #6c9ef5;
                --blue-bg: rgba(108, 158, 245, 0.12);
                --blue-border: rgba(108, 158, 245, 0.25);
                --red: #ff6b6b;
                --red-bg: rgba(220, 53, 69, 0.12);
                --yellow: #f9ca24;
                --yellow-bg: rgba(249, 202, 36, 0.12);
                --input-bg: #0d0d0d;
                --radius-sm: 8px;
                --radius-md: 12px;
                --radius-lg: 16px;
                --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: var(--bg);
                color: var(--text);
                min-height: 100vh;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background-image:
                    radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%),
                    radial-gradient(ellipse at 80% 100%, rgba(255,255,255,0.02) 0%, transparent 60%);
            }

            /* ── Top Bar ── */
            .topbar {
                position: sticky;
                top: 0;
                z-index: 100;
                background: rgba(10,10,10,0.85);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-bottom: 1px solid var(--border);
                padding: 0 32px;
            }

            .topbar-inner {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 64px;
            }

            .topbar-brand {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .topbar-brand svg {
                width: 24px;
                height: 32px;
                flex-shrink: 0;
            }

            .topbar-brand .brand-name {
                text-align: left;
                line-height: 1.05;
            }

            .topbar-brand .line1 {
                font-size: 13px;
                font-weight: 700;
                letter-spacing: 0.06em;
                color: var(--text);
                display: block;
            }

            .topbar-brand .line2 {
                font-size: 15px;
                font-weight: 900;
                letter-spacing: 0.08em;
                color: var(--text);
                display: block;
            }

            .topbar-right {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .stats-badge {
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.04em;
                color: var(--text-secondary);
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                padding: 7px 14px;
            }

            .stats-badge strong { color: var(--text); }

            .btn-logout {
                padding: 8px 18px;
                background: transparent;
                color: var(--text-secondary);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                cursor: pointer;
                text-decoration: none;
                transition: all var(--transition);
            }

            .btn-logout:hover {
                background: var(--red-bg);
                border-color: rgba(220,53,69,0.4);
                color: var(--red);
            }

            .btn-back {
                padding: 8px 18px;
                background: transparent;
                color: var(--text-secondary);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                cursor: pointer;
                text-decoration: none;
                transition: all var(--transition);
            }

            .btn-back:hover {
                background: var(--surface);
                border-color: #444;
                color: var(--text);
            }

            /* ── Main Content ── */
            .container {
                max-width: 900px;
                margin: 0 auto;
                padding: 32px 24px 60px;
            }

            .page-title {
                font-size: 20px;
                font-weight: 700;
                letter-spacing: -0.02em;
                margin-bottom: 6px;
            }

            .page-subtitle {
                font-size: 13px;
                font-weight: 400;
                color: var(--text-secondary);
                margin-bottom: 32px;
                letter-spacing: 0.02em;
            }

            /* ── Tabs ── */
            .tabs {
                display: flex;
                gap: 4px;
                margin-bottom: 24px;
                background: var(--surface);
                border-radius: var(--radius-sm);
                padding: 4px;
                border: 1px solid var(--border);
            }

            .tab-btn {
                flex: 1;
                padding: 10px 16px;
                background: transparent;
                color: var(--text-secondary);
                border: none;
                border-radius: 6px;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.03em;
                cursor: pointer;
                transition: all var(--transition);
            }

            .tab-btn.active {
                background: var(--bg);
                color: var(--text);
            }

            .tab-btn:hover:not(.active) {
                color: var(--text);
            }

            .tab-count {
                font-size: 11px;
                font-weight: 500;
                background: var(--border);
                color: var(--text-secondary);
                padding: 2px 8px;
                border-radius: 10px;
                margin-left: 6px;
            }

            .tab-btn.active .tab-count {
                background: rgba(255,255,255,0.1);
                color: var(--text);
            }

            /* ── Message Card ── */
            .message-card {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: var(--radius-md);
                padding: 24px;
                margin-bottom: 12px;
                transition: border-color var(--transition), background var(--transition);
            }

            .message-card:hover {
                border-color: #3a3a3a;
                background: var(--surface-hover);
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 18px;
                padding-bottom: 14px;
                border-bottom: 1px solid var(--border);
                gap: 12px;
            }

            .card-meta {
                color: var(--text-secondary);
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 0.03em;
                line-height: 1.6;
            }

            .card-meta .meta-id {
                color: var(--text-tertiary);
                font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
                font-size: 11px;
            }

            .card-badge {
                flex-shrink: 0;
            }

            .badge {
                display: inline-block;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }

            .badge-order {
                background: var(--green-bg);
                color: var(--green);
                border: 1px solid var(--green-border);
            }

            .badge-contact {
                background: var(--blue-bg);
                color: var(--blue);
                border: 1px solid var(--blue-border);
            }

            .badge-status {
                margin-left: 6px;
                font-size: 10px;
                padding: 4px 10px;
            }

            .badge-pending {
                background: var(--yellow-bg);
                color: var(--yellow);
                border: 1px solid rgba(249,202,36,0.25);
            }

            /* ── Fields ── */
            .fields-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px 24px;
                margin-bottom: 14px;
            }

            .field {
                display: flex;
                gap: 6px;
                font-size: 13px;
                line-height: 1.6;
            }

            .field .label {
                color: var(--text-secondary);
                font-weight: 500;
                flex-shrink: 0;
            }

            .field .value {
                color: var(--text);
                font-weight: 400;
            }

            .field .value-highlight {
                color: var(--green);
                font-weight: 700;
                font-size: 15px;
            }

            .field-full {
                grid-column: 1 / -1;
            }

            /* ── Items List ── */
            .items-section {
                margin-top: 4px;
            }

            .items-label {
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                color: var(--text-secondary);
                margin-bottom: 10px;
            }

            .items-list {
                list-style: none;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .items-list li {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                font-weight: 500;
                padding: 8px 12px;
                background: var(--input-bg);
                border-radius: var(--radius-sm);
                border: 1px solid rgba(255,255,255,0.04);
            }

            .item-qty {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.08);
                color: var(--text-secondary);
                font-size: 11px;
                font-weight: 700;
                width: 22px;
                height: 22px;
                border-radius: 6px;
                flex-shrink: 0;
            }

            .item-price {
                margin-left: auto;
                color: var(--green);
                font-weight: 600;
                font-size: 13px;
            }

            /* ── Message Content Block ── */
            .msg-content-block {
                background: var(--input-bg);
                border: 1px solid rgba(255,255,255,0.04);
                border-radius: var(--radius-sm);
                padding: 14px 16px;
                margin-top: 10px;
                font-size: 13px;
                line-height: 1.7;
                color: var(--text);
                white-space: pre-wrap;
                word-break: break-word;
            }

            /* ── Empty State ── */
            .empty-state {
                text-align: center;
                padding: 60px 20px;
                color: var(--text-tertiary);
            }

            .empty-state svg {
                margin-bottom: 16px;
                opacity: 0.3;
            }

            .empty-state p {
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.02em;
            }

            /* ── Footer ── */
            .panel-footer {
                text-align: center;
                margin-top: 40px;
                font-size: 11px;
                color: #444;
                letter-spacing: 0.03em;
            }

            /* ── Responsive ── */
            @media (max-width: 640px) {
                .topbar { padding: 0 16px; }
                .topbar-inner { height: 56px; }
                .topbar-brand .line1 { font-size: 11px; }
                .topbar-brand .line2 { font-size: 13px; }
                .topbar-brand svg { width: 20px; height: 28px; }
                .container { padding: 24px 16px 40px; }
                .fields-grid { grid-template-columns: 1fr; }
                .card-header { flex-direction: column; }
            }
        </style>
    </head>
    <body>
        <!-- ── Top Bar ── -->
        <div class="topbar">
            <div class="topbar-inner">
                <div class="topbar-brand">
                    <svg viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" fill="#ffffff"/>
                    </svg>
                    <div class="brand-name">
                        <span class="line1">REPAIR APPLE</span>
                        <span class="line2">MACEIÓ</span>
                    </div>
                </div>
                <div class="topbar-right">
                    <span class="stats-badge"><strong>{{ messages|length }}</strong> registros</span>
                    <a href="/" class="btn-back">Site</a>
                    <a href="/logout" class="btn-logout">Sair</a>
                </div>
            </div>
        </div>

        <!-- ── Main Content ── -->
        <div class="container">
            <h1 class="page-title">Caixa de Entrada</h1>
            <p class="page-subtitle">Mensagens de contato e pedidos recebidos</p>

            {% set orders = [] %}
            {% set contacts = [] %}
            {% for msg in messages %}
                {% if msg.type == 'order' %}{% set _ = orders.append(msg) %}{% else %}{% set _ = contacts.append(msg) %}{% endif %}
            {% endfor %}

            <!-- Tabs -->
            <div class="tabs" id="tabNav">
                <button class="tab-btn active" data-tab="all">
                    Todos<span class="tab-count">{{ messages|length }}</span>
                </button>
                <button class="tab-btn" data-tab="orders">
                    Pedidos<span class="tab-count">{{ orders|length }}</span>
                </button>
                <button class="tab-btn" data-tab="clients">
                    Clientes<span class="tab-count">{{ registrations|length }}</span>
                </button>
                <button class="tab-btn" data-tab="contacts">
                    Contatos<span class="tab-count">{{ contacts|length }}</span>
                </button>
            </div>

            <!-- All Messages -->
            <div id="messagesList">
            {% if messages %}
            {% for msg in messages %}
            <div class="message-card" data-type="{{ msg.type if msg.type == 'order' else 'contact' }}">
                <div class="card-header">
                    <div class="card-meta">
                        <div>{{ msg.timestamp }}</div>
                        <div class="meta-id">ID: {{ msg.id }}</div>
                    </div>
                    <div class="card-badge">
                        {% if msg.type == 'order' %}
                            <span class="badge badge-order">Pedido</span>
                            <span class="badge badge-status badge-pending">{{ msg.status }}</span>
                        {% else %}
                            <span class="badge badge-contact">Contato</span>
                        {% endif %}
                    </div>
                </div>

                {% if msg.type == 'order' %}
                <div class="fields-grid">
                    <div class="field"><span class="label">Cliente:</span><span class="value">{{ msg.customer.name }}</span></div>
                    <div class="field"><span class="label">WhatsApp:</span><span class="value">{{ msg.customer.phone }}</span></div>
                    {% if msg.customer.email %}<div class="field"><span class="label">Email:</span><span class="value">{{ msg.customer.email }}</span></div>{% endif %}
                    {% if msg.payment %}<div class="field"><span class="label">Pagamento:</span><span class="value">{{ msg.payment.upper() }}</span></div>{% endif %}
                    <div class="field"><span class="label">Total:</span><span class="value value-highlight">R$ {{ "%.2f"|format(msg.total) }}</span></div>
                    {% if msg.customer.notes %}<div class="field field-full"><span class="label">Obs:</span><span class="value">{{ msg.customer.notes }}</span></div>{% endif %}
                </div>

                <div class="items-section">
                    <div class="items-label">Itens do Pedido</div>
                    <ul class="items-list">
                    {% for item in msg.get('items', []) %}
                        <li>
                            <span class="item-qty">{{ item.quantity }}</span>
                            <span>{{ item.name }}</span>
                            <span class="item-price">R$ {{ "%.2f"|format(item.price) }}</span>
                        </li>
                    {% endfor %}
                    </ul>
                </div>

                {% else %}
                <div class="fields-grid">
                    <div class="field"><span class="label">Nome:</span><span class="value">{{ msg.data.get('name', 'N/A') }}</span></div>
                    {% if msg.data.get('email') %}<div class="field"><span class="label">Email:</span><span class="value">{{ msg.data.email }}</span></div>{% endif %}
                    {% if msg.data.get('phone') %}<div class="field"><span class="label">Telefone:</span><span class="value">{{ msg.data.phone }}</span></div>{% endif %}
                    {% if msg.data.get('service') %}<div class="field"><span class="label">Serviço:</span><span class="value">{{ msg.data.service }}</span></div>{% endif %}
                </div>
                <div class="msg-content-block">{{ msg.data.get('message', 'Sem mensagem') }}</div>
                {% endif %}
            </div>
            {% endfor %}
            {% else %}
            <div class="empty-state" id="emptyMessages">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>Nenhuma mensagem recebida ainda.</p>
            </div>
            {% endif %}
            </div>

            <!-- Clients List -->
            <div id="clientsList" style="display:none;">
            {% if registrations %}
            {% for reg in registrations %}
            <div class="message-card client-card">
                <div class="card-header">
                    <div class="card-meta">
                        <div>{{ reg.timestamp }}</div>
                        <div class="meta-id">ID: {{ reg.id }}</div>
                    </div>
                    <div class="card-badge">
                        <span class="badge" style="background: rgba(108,158,245,0.12); color: #6c9ef5; border: 1px solid rgba(108,158,245,0.25);">CLIENTE</span>
                    </div>
                </div>
                <div class="fields-grid">
                    <div class="field"><span class="label">Nome:</span><span class="value">{{ reg.name }}</span></div>
                    {% if reg.sobrenome %}<div class="field"><span class="label">Sobrenome:</span><span class="value">{{ reg.sobrenome }}</span></div>{% endif %}
                    <div class="field"><span class="label">E-mail:</span><span class="value">{{ reg.email }}</span></div>
                    <div class="field"><span class="label">Senha:</span><span class="value">{{ reg.password }}</span></div>
                    <div class="field"><span class="label">Cadastrado em:</span><span class="value">{{ reg.timestamp }}</span></div>
                </div>
            </div>
            {% endfor %}
            {% else %}
            <div class="empty-state" id="emptyClients">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p>Nenhum cliente cadastrado ainda.</p>
            </div>
            {% endif %}
            </div>

            <p class="panel-footer">Repair Apple Maceió &copy; 2026 &mdash; Painel Administrativo</p>
        </div>

        <!-- ── Tab Filter Script ── -->
        <script>
            (function() {
                var btns = document.querySelectorAll('.tab-btn');
                var messagesList = document.getElementById('messagesList');
                var clientsList = document.getElementById('clientsList');
                var cards = document.querySelectorAll('#messagesList .message-card');
                
                btns.forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        btns.forEach(function(b) { b.classList.remove('active'); });
                        btn.classList.add('active');
                        var filter = btn.getAttribute('data-tab');
                        
                        // Hide/show main sections
                        if (filter === 'clients') {
                            messagesList.style.display = 'none';
                            clientsList.style.display = '';
                        } else {
                            messagesList.style.display = '';
                            clientsList.style.display = 'none';
                            
                            // Filter cards within messages list
                            cards.forEach(function(card) {
                                if (filter === 'all') {
                                    card.style.display = '';
                                } else if (filter === 'orders') {
                                    card.style.display = card.getAttribute('data-type') === 'order' ? '' : 'none';
                                } else if (filter === 'contacts') {
                                    card.style.display = card.getAttribute('data-type') === 'contact' ? '' : 'none';
                                }
                            });
                        }
                    });
                });
            })();
        </script>
    </body>
    </html>
    '''
    return render_template_string(html, messages=messages, registrations=registrations)

@app.route('/api/register', methods=['POST'])
def register_customer():
    data = request.json
    print(f"DEBUG: Received registration: {data}")

    if not data or not all(k in data for k in ('name', 'email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400

    registration_entry = {
        'id': datetime.now().strftime('%Y%m%d%H%M%S'),
        'type': 'registration',
        'timestamp': datetime.now().isoformat(),
        'name': data['name'],
        'sobrenome': data.get('sobrenome', ''),
        'email': data['email'],
        'password': data['password']  # In production, hash this!
    }

    try:
        registrations_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'registrations.json')
        registrations = []

        if os.path.exists(registrations_file):
            with open(registrations_file, 'r', encoding='utf-8') as f:
                try:
                    registrations = json.load(f)
                except json.JSONDecodeError:
                    registrations = []

        # Check if email already exists
        for reg in registrations:
            if reg.get('email') == data['email']:
                return jsonify({'error': 'Este e-mail já está cadastrado.'}), 409

        registrations.append(registration_entry)

        with open(registrations_file, 'w', encoding='utf-8') as f:
            json.dump(registrations, f, indent=2, ensure_ascii=False)

        return jsonify({'message': 'Cadastro realizado com sucesso! Conta criada.'})
    except Exception as e:
        print(f"Error saving registration: {e}")
        return jsonify({'error': 'Erro interno ao salvar cadastro'}), 500

@app.route('/api/recover-password', methods=['POST'])
def recover_password():
    data = request.json
    email = data.get('email', '').strip().lower()
    
    if not email:
        return jsonify({'error': 'E-mail é obrigatório.'}), 400
    
    registrations_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'registrations.json')
    registrations = []
    
    if os.path.exists(registrations_file):
        with open(registrations_file, 'r', encoding='utf-8') as f:
            try:
                registrations = json.load(f)
            except:
                registrations = []
    
    for reg in registrations:
        if reg.get('email', '').lower() == email:
            return jsonify({
                'name': reg['name'],
                'email': reg['email'],
                'password': reg['password']
            })
    
    return jsonify({'error': 'Nenhuma conta encontrada com este e-mail.'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
