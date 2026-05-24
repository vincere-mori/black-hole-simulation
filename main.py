import sys
import os
import math
import struct
import pygame
from OpenGL.GL import *
from OpenGL.GL.shaders import compileProgram, compileShader

# Initialize Pygame
pygame.init()
pygame.display.set_caption("Stellar Cartography — Deep Space Explorer")

# Window settings
WIDTH, HEIGHT = 960, 540
screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.OPENGL | pygame.DOUBLEBUF | pygame.RESIZABLE)

# Paths and Shader directories
SHADERS_DIR = os.path.join(os.path.dirname(__file__), "shaders")

# Object metadata and file mappings
OBJECTS = {
    "1": {"file": "black-hole.frag", "name": "Black Hole Singularity", "rs": 1.0, "outer": 9.5, "speed": 1.6, "dop": 1.0, "dist": 1.0},
    "2": {"file": "pulsar.frag", "name": "Vela Pulsar", "rs": 0.8, "outer": 12.0, "speed": 2.0, "dop": 1.0, "dist": 1.0},
    "3": {"file": "wormhole.frag", "name": "Cygnus Wormhole", "rs": 1.0, "outer": 10.0, "speed": 1.0, "dop": 1.0, "dist": 1.0},
    "4": {"file": "dyson-sphere.frag", "name": "Kepler Dyson Sphere", "rs": 0.9, "outer": 2.8, "speed": 1.5, "dop": 1.8, "dist": 0.0}
}

active_key = "1"
current_obj = OBJECTS[active_key]

# Color Themes matching the Web app
THEMES = {
    "1": [ # Black Hole themes
        {"c1": (1.0, 0.85, 0.5), "c2": (0.9, 0.22, 0.02), "name": "Gargantua Orange"},
        {"c1": (0.4, 0.95, 1.0), "c2": (0.01, 0.2, 0.8), "name": "Cosmic Cyan"},
        {"c1": (0.9, 0.5, 1.0), "c2": (0.3, 0.01, 0.65), "name": "Quantum Purple"}
    ],
    "2": [ # Pulsar themes
        {"c1": (0.0, 0.9, 1.0), "c2": (0.32, 0.0, 1.0), "name": "Gamma Blue"},
        {"c1": (1.0, 0.25, 0.25), "c2": (0.9, 0.0, 1.0), "name": "Magnetar Purple"}
    ],
    "3": [ # Wormhole themes
        {"c1": (0.9, 0.0, 1.0), "c2": (0.0, 0.9, 1.0), "name": "Nebula Portal"},
        {"c1": (1.0, 0.75, 0.0), "c2": (0.0, 1.0, 0.4), "name": "Gold-Emerald Bridge"}
    ],
    "4": [ # Dyson Sphere themes
        {"c1": (1.0, 0.6, 0.0), "c2": (1.0, 0.8, 0.0), "name": "Solar Gold"},
        {"c1": (0.0, 0.9, 1.0), "c2": (1.0, 1.0, 1.0), "name": "Sirius White-Blue"}
    ]
}

theme_idx = 0

# Simulation parameters (updated by active object)
params = {
    "rs": current_obj["rs"],
    "inner_radius": 2.2,
    "outer_radius": current_obj["outer"],
    "spin_speed": current_obj["speed"],
    "doppler_strength": current_obj["dop"],
    "noise_scale": 1.4,
    "noise_detail": 4.5,
    "beaming_scale": 0.0,
    "distortion": current_obj["dist"],
    "star_density": 1.0
}

# Vertex shader (full-screen quad)
vert_shader_source = """
#version 330 core
in vec2 in_vert;
out vec2 vUv;
void main() {
    vUv = in_vert * 0.5 + 0.5;
    gl_Position = vec4(in_vert, 0.0, 1.0);
}
"""

program = None
vao = None
vbo = None

# Uniform location caches
locs = {}

def compile_object_shader(obj_key):
    global program, vao, vbo, locs, params, theme_idx
    obj = OBJECTS[obj_key]
    
    # Load parameters
    params["rs"] = obj["rs"]
    params["outer_radius"] = obj["outer"]
    params["spin_speed"] = obj["speed"]
    params["doppler_strength"] = obj["dop"]
    params["distortion"] = obj["dist"]
    theme_idx = 0
    
    if obj_key == "4": # Dyson sphere inner radius is star size, not horizon scale
        params["inner_radius"] = obj["rs"] * 0.9
    else:
        params["inner_radius"] = obj["rs"] * 2.2
        
    shader_path = os.path.join(SHADERS_DIR, obj["file"])
    with open(shader_path, "r", encoding="utf-8") as f:
        frag_source = f.read()

    # Convert GLSL ES 3.0 header to Desktop GLSL 3.3 Core
    if frag_source.startswith("#version 300 es"):
        frag_source = frag_source.replace("#version 300 es", "#version 330 core", 1)

    try:
        # Clear old program if it exists
        if program is not None:
            glDeleteProgram(program)
            
        vert_shader = compileShader(vert_shader_source, GL_VERTEX_SHADER)
        frag_shader = compileShader(frag_source, GL_FRAGMENT_SHADER)
        program = compileProgram(vert_shader, frag_shader)
    except Exception as e:
        print(f"Error compiling shader for {obj['name']}:")
        print(e)
        return False

    # Build VAO/VBO
    if vao is not None:
        glDeleteVertexArrays(1, [vao])
    if vbo is not None:
        glDeleteBuffers(1, [vbo])
        
    vertices = [
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
    ]
    vertices_data = struct.pack('12f', *vertices)

    vao = glGenVertexArrays(1)
    glBindVertexArray(vao)

    vbo = glGenBuffers(1)
    glBindBuffer(GL_ARRAY_BUFFER, vbo)
    glBufferData(GL_ARRAY_BUFFER, len(vertices_data), vertices_data, GL_STATIC_DRAW)

    in_vert_loc = glGetAttribLocation(program, "in_vert")
    glEnableVertexAttribArray(in_vert_loc)
    glVertexAttribPointer(in_vert_loc, 2, GL_FLOAT, GL_FALSE, 0, None)
    glBindVertexArray(0)

    # Cache Uniform Locations
    locs = {
        "uCamPos": glGetUniformLocation(program, 'uCamPos'),
        "uInvProjection": glGetUniformLocation(program, 'uInvProjection'),
        "uCamWorld": glGetUniformLocation(program, 'uCamWorld'),
        "uTime": glGetUniformLocation(program, 'uTime'),
        "uRs": glGetUniformLocation(program, 'uRs'),
        "uInnerRadius": glGetUniformLocation(program, 'uInnerRadius'),
        "uOuterRadius": glGetUniformLocation(program, 'uOuterRadius'),
        "uSpinSpeed": glGetUniformLocation(program, 'uSpinSpeed'),
        "uDopplerStrength": glGetUniformLocation(program, 'uDopplerStrength'),
        "uNoiseScale": glGetUniformLocation(program, 'uNoiseScale'),
        "uNoiseDetail": glGetUniformLocation(program, 'uNoiseDetail'),
        "uBeamingScale": glGetUniformLocation(program, 'uBeamingScale'),
        "uDistortion": glGetUniformLocation(program, 'uDistortion'),
        "uStarDensity": glGetUniformLocation(program, 'uStarDensity'),
        "uColorTheme1": glGetUniformLocation(program, 'uColorTheme1'),
        "uColorTheme2": glGetUniformLocation(program, 'uColorTheme2')
    }
    
    print(f"--> Loaded anomaly simulator: {obj['name']}")
    return True

# Initialize default shader
compile_object_shader(active_key)

# Camera state
cam_theta = math.pi / 2.2  # pitch
cam_phi = 0.0              # yaw
cam_dist = 17.0            # distance
auto_rotate = True

def print_help():
    print("=" * 60)
    print("           STELLAR CARTOGRAPHY EXPLORER (DESKTOP)")
    print("=" * 60)
    print("Key bindings to switch space objects:")
    print("  1  : Schwarzschild Black Hole")
    print("  2  : Vela Pulsar")
    print("  3  : Cygnus Wormhole")
    print("  4  : Kepler Dyson Sphere")
    print("  ")
    print("Camera Controls:")
    print("  Mouse Drag       : Orbit Camera")
    print("  Mouse Scroll     : Zoom In/Out")
    print("  SPACE            : Toggle Camera Autopilot")
    print("  ")
    print("Shader Parameters:")
    print("  Q / A            : Increase / Decrease Horizon / Star Mass (Rs)")
    print("  W / S            : Increase / Decrease Rotation Speed")
    print("  E / D            : Increase / Decrease Telemetry / Doppler Glow")
    print("  R / F            : Increase / Decrease Spacetime Distortion (Lensing)")
    print("  T                : Swap Active Color Theme")
    print("  ESC              : Exit Program")
    print("=" * 60)

print_help()

clock = pygame.time.Clock()
start_time = pygame.time.get_ticks()

dragging = False
last_mouse_pos = (0, 0)

running = True
while running:
    dt = clock.tick(60) / 1000.0
    current_time = (pygame.time.get_ticks() - start_time) / 1000.0
    
    # Event Handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
            
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
            elif event.key in [pygame.K_1, pygame.K_2, pygame.K_3, pygame.K_4]:
                key_char = pygame.key.name(event.key)
                if key_char in OBJECTS and key_char != active_key:
                    active_key = key_char
                    current_obj = OBJECTS[active_key]
                    compile_object_shader(active_key)
            elif event.key == pygame.K_SPACE:
                auto_rotate = not auto_rotate
            elif event.key == pygame.K_t:
                active_themes = THEMES[active_key]
                theme_idx = (theme_idx + 1) % len(active_themes)
                print(f"Theme switched to: {active_themes[theme_idx]['name']}")
                
        elif event.type == pygame.VIDEORESIZE:
            WIDTH, HEIGHT = event.size
            glViewport(0, 0, WIDTH, HEIGHT)
            
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:
                dragging = True
                last_mouse_pos = event.pos
            elif event.button == 4:
                cam_dist = max(3.5, cam_dist - 0.5)
            elif event.button == 5:
                cam_dist = min(35.0, cam_dist + 0.5)
                
        elif event.type == pygame.MOUSEBUTTONUP:
            if event.button == 1:
                dragging = False
                
        elif event.type == pygame.MOUSEMOTION:
            if dragging:
                dx, dy = event.pos[0] - last_mouse_pos[0], event.pos[1] - last_mouse_pos[1]
                cam_phi += dx * 0.007
                cam_theta = max(0.05, min(math.pi - 0.05, cam_theta - dy * 0.007))
                last_mouse_pos = event.pos

    # Continuous input adjustments
    keys = pygame.key.get_pressed()
    if keys[pygame.K_q]:
        params["rs"] = min(2.5, params["rs"] + 0.02)
    if keys[pygame.K_a]:
        params["rs"] = max(0.15, params["rs"] - 0.02)
        
    if keys[pygame.K_w]:
        params["spin_speed"] = min(5.0, params["spin_speed"] + 0.04)
    if keys[pygame.K_s]:
        params["spin_speed"] = max(0.0, params["spin_speed"] - 0.04)
        
    if keys[pygame.K_e]:
        params["doppler_strength"] = min(3.0, params["doppler_strength"] + 0.03)
    if keys[pygame.K_d]:
        params["doppler_strength"] = max(0.0, params["doppler_strength"] - 0.03)
        
    if keys[pygame.K_r]:
        params["distortion"] = min(3.0, params["distortion"] + 0.02)
    if keys[pygame.K_f]:
        params["distortion"] = max(0.0, params["distortion"] - 0.02)

    # Dynamic limits for boundaries
    if active_key == "4": # Dyson star
        params["inner_radius"] = params["rs"] * 0.9
        params["outer_radius"] = max(params["rs"] * 1.6, params["outer_radius"])
    else:
        params["inner_radius"] = params["rs"] * 2.2
        params["outer_radius"] = max(params["inner_radius"] + 2.0, params["outer_radius"])

    # Update Title details
    t_list = THEMES[active_key]
    pygame.display.set_caption(
        f"{current_obj['name']} | Rs: {params['rs']:.2f} | Speed: {params['spin_speed']:.2f} | "
        f"Glow: {params['doppler_strength']:.2f} | Warp: {params['distortion']:.2f} | Theme: {t_list[theme_idx]['name']}"
    )

    # Auto Camera orbit
    if auto_rotate and not dragging:
        cam_phi += 0.0025

    # Polar camera coordinate calculations
    cam_x = cam_dist * math.sin(cam_theta) * math.cos(cam_phi)
    cam_y = cam_dist * math.cos(cam_theta)
    cam_z = cam_dist * math.sin(cam_theta) * math.sin(cam_phi)
    eye = (cam_x, cam_y, cam_z)
    
    target = (0.0, 0.0, 0.0)
    up = (0.0, 1.0, 0.0)
    
    # Calculate Forward, Right, Up camera axes
    z_x, z_y, z_z = eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]
    z_len = math.sqrt(z_x*z_x + z_y*z_y + z_z*z_z)
    zaxis = (z_x / z_len, z_y / z_len, z_z / z_len)
    
    r_x = up[1]*zaxis[2] - up[2]*zaxis[1]
    r_y = up[2]*zaxis[0] - up[0]*zaxis[2]
    r_z = up[0]*zaxis[1] - up[1]*zaxis[0]
    r_len = math.sqrt(r_x*r_x + r_y*r_y + r_z*r_z)
    xaxis = (r_x / r_len, r_y / r_len, r_z / r_len)
    
    yaxis = (
        zaxis[1]*xaxis[2] - zaxis[2]*xaxis[1],
        zaxis[2]*xaxis[0] - zaxis[0]*xaxis[2],
        zaxis[0]*xaxis[1] - zaxis[1]*xaxis[0]
    )

    # Column-major Camera world transformation matrix
    uCamWorld = [
        xaxis[0], xaxis[1], xaxis[2], 0.0,
        yaxis[0], yaxis[1], yaxis[2], 0.0,
        zaxis[0], zaxis[1], zaxis[2], 0.0,
        eye[0],   eye[1],   eye[2],   1.0
    ]

    # Inverse Perspective Projection matrix
    fov = 45.0
    aspect = WIDTH / HEIGHT
    tan_fov = math.tan(math.radians(fov) / 2.0)
    uInvProjection = [
        tan_fov * aspect, 0.0, 0.0, 0.0,
        0.0, tan_fov, 0.0, 0.0,
        0.0, 0.0, 0.0, -1.0,
        0.0, 0.0, -1.0, 0.0
    ]

    # Render Draw Pass
    glClearColor(0.0, 0.0, 0.0, 1.0)
    glClear(GL_COLOR_BUFFER_BIT)
    
    glUseProgram(program)
    
    # Send camera matrices and uniforms
    glUniform3f(locs["uCamPos"], eye[0], eye[1], eye[2])
    glUniformMatrix4fv(locs["uInvProjection"], 1, GL_FALSE, uInvProjection)
    glUniformMatrix4fv(locs["uCamWorld"], 1, GL_FALSE, uCamWorld)
    
    glUniform1f(locs["uTime"], current_time)
    glUniform1f(locs["uRs"], params["rs"])
    glUniform1f(locs["uInnerRadius"], params["inner_radius"])
    glUniform1f(locs["uOuterRadius"], params["outer_radius"])
    glUniform1f(locs["uSpinSpeed"], params["spin_speed"])
    glUniform1f(locs["uDopplerStrength"], params["doppler_strength"])
    glUniform1f(locs["uNoiseScale"], params["noise_scale"])
    glUniform1f(locs["uNoiseDetail"], params["noise_detail"])
    glUniform1f(locs["uBeamingScale"], params["beaming_scale"])
    glUniform1f(locs["uDistortion"], params["distortion"])
    glUniform1f(locs["uStarDensity"], params["star_density"])
    
    active_theme = THEMES[active_key][theme_idx]
    glUniform3f(locs["uColorTheme1"], active_theme["c1"][0], active_theme["c1"][1], active_theme["c1"][2])
    glUniform3f(locs["uColorTheme2"], active_theme["c2"][0], active_theme["c2"][1], active_theme["c2"][2])

    glBindVertexArray(vao)
    glDrawArrays(GL_TRIANGLES, 0, 6)
    glBindVertexArray(0)
    
    pygame.display.flip()

pygame.quit()
