import sys
import os
import math
import struct
import pygame
from OpenGL.GL import *
from OpenGL.GL.shaders import compileProgram, compileShader

# Initialize Pygame
pygame.init()
pygame.display.set_caption("Black Hole Relativistic Simulation")

# Window settings
WIDTH, HEIGHT = 960, 540
screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.OPENGL | pygame.DOUBLEBUF | pygame.RESIZABLE)

# Read fragment shader
shader_path = os.path.join(os.path.dirname(__file__), "shader.frag")
with open(shader_path, "r", encoding="utf-8") as f:
    frag_shader_source = f.read()

# Desktop GLSL compatibility replacement:
# Converts GLSL ES 3.0 header to Desktop GLSL 3.3 Core header
if frag_shader_source.startswith("#version 300 es"):
    frag_shader_source = frag_shader_source.replace("#version 300 es", "#version 330 core", 1)

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

try:
    vert_shader = compileShader(vert_shader_source, GL_VERTEX_SHADER)
    frag_shader = compileShader(frag_shader_source, GL_FRAGMENT_SHADER)
    program = compileProgram(vert_shader, frag_shader)
except Exception as e:
    print("Shader Compilation Error:")
    print(e)
    sys.exit(1)

# Setup full-screen quad VBO/VAO
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

# Setup position attribute channel
in_vert_loc = glGetAttribLocation(program, "in_vert")
glEnableVertexAttribArray(in_vert_loc)
glVertexAttribPointer(in_vert_loc, 2, GL_FLOAT, GL_FALSE, 0, None)

glBindVertexArray(0)

# Get Uniform Locations
uCamPos_loc = glGetUniformLocation(program, 'uCamPos')
uInvProjection_loc = glGetUniformLocation(program, 'uInvProjection')
uCamWorld_loc = glGetUniformLocation(program, 'uCamWorld')
uTime_loc = glGetUniformLocation(program, 'uTime')
uRs_loc = glGetUniformLocation(program, 'uRs')
uInnerRadius_loc = glGetUniformLocation(program, 'uInnerRadius')
uOuterRadius_loc = glGetUniformLocation(program, 'uOuterRadius')
uSpinSpeed_loc = glGetUniformLocation(program, 'uSpinSpeed')
uDopplerStrength_loc = glGetUniformLocation(program, 'uDopplerStrength')
uNoiseScale_loc = glGetUniformLocation(program, 'uNoiseScale')
uNoiseDetail_loc = glGetUniformLocation(program, 'uNoiseDetail')
uBeamingScale_loc = glGetUniformLocation(program, 'uBeamingScale')
uDistortion_loc = glGetUniformLocation(program, 'uDistortion')
uStarDensity_loc = glGetUniformLocation(program, 'uStarDensity')
uColorTheme1_loc = glGetUniformLocation(program, 'uColorTheme1')
uColorTheme2_loc = glGetUniformLocation(program, 'uColorTheme2')

# Predefined Color Themes
THEMES = [
    # Gargantua Orange (Classic)
    {"c1": (1.0, 0.85, 0.5), "c2": (0.9, 0.22, 0.02), "name": "Gargantua Orange"},
    # Cosmic Cyan
    {"c1": (0.4, 0.95, 1.0), "c2": (0.01, 0.2, 0.8), "name": "Cosmic Cyan"},
    # Quantum Purple
    {"c1": (0.9, 0.5, 1.0), "c2": (0.3, 0.01, 0.65), "name": "Quantum Purple"},
    # Singularity Crimson
    {"c1": (1.0, 0.4, 0.4), "c2": (0.7, 0.02, 0.1), "name": "Singularity Crimson"}
]

# Simulation parameters
params = {
    "rs": 1.0,
    "inner_radius": 2.2,
    "outer_radius": 9.5,
    "spin_speed": 1.6,
    "doppler_strength": 1.0,
    "noise_scale": 1.4,
    "noise_detail": 4.5,
    "beaming_scale": 0.0,
    "distortion": 1.0,
    "star_density": 1.0,
    "theme_idx": 0
}

# Camera state
cam_theta = math.pi / 2.2  # pitch
cam_phi = 0.0              # yaw
cam_dist = 18.0            # distance from singularity
auto_rotate = True

def print_help():
    print("=" * 60)
    print("           BLACK HOLE RELATIVISTIC SIMULATION")
    print("=" * 60)
    print("Controls:")
    print("  Mouse Drag       : Orbit Camera")
    print("  Mouse Scroll     : Zoom In/Out")
    print("  SPACE            : Toggle Camera Auto-rotation")
    print("  ")
    print("Adjust Parameters:")
    print("  Q / A            : Increase / Decrease BH Mass (Rs)")
    print("  W / S            : Increase / Decrease Spin Speed")
    print("  E / D            : Increase / Decrease Doppler Beaming")
    print("  R / F            : Increase / Decrease Lensing Distortion")
    print("  T                : Cycle Color Theme")
    print("  ESC              : Quit")
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
    
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
            
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
            elif event.key == pygame.K_SPACE:
                auto_rotate = not auto_rotate
            elif event.key == pygame.K_t:
                params["theme_idx"] = (params["theme_idx"] + 1) % len(THEMES)
                print(f"Theme switched to: {THEMES[params['theme_idx']]['name']}")
                
        elif event.type == pygame.VIDEORESIZE:
            WIDTH, HEIGHT = event.size
            glViewport(0, 0, WIDTH, HEIGHT)
            
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:
                dragging = True
                last_mouse_pos = event.pos
            elif event.button == 4: # Scroll up (zoom in)
                cam_dist = max(4.0, cam_dist - 0.6)
            elif event.button == 5: # Scroll down (zoom out)
                cam_dist = min(40.0, cam_dist + 0.6)
                
        elif event.type == pygame.MOUSEBUTTONUP:
            if event.button == 1:
                dragging = False
                
        elif event.type == pygame.MOUSEMOTION:
            if dragging:
                dx, dy = event.pos[0] - last_mouse_pos[0], event.pos[1] - last_mouse_pos[1]
                cam_phi += dx * 0.007
                cam_theta = max(0.05, min(math.pi - 0.05, cam_theta - dy * 0.007))
                last_mouse_pos = event.pos

    # Continuous keyboard input for parameters
    keys = pygame.key.get_pressed()
    if keys[pygame.K_q]:
        params["rs"] = min(2.5, params["rs"] + 0.02)
    if keys[pygame.K_a]:
        params["rs"] = max(0.2, params["rs"] - 0.02)
        
    if keys[pygame.K_w]:
        params["spin_speed"] = min(5.0, params["spin_speed"] + 0.05)
    if keys[pygame.K_s]:
        params["spin_speed"] = max(0.0, params["spin_speed"] - 0.05)
        
    if keys[pygame.K_e]:
        params["doppler_strength"] = min(3.0, params["doppler_strength"] + 0.03)
    if keys[pygame.K_d]:
        params["doppler_strength"] = max(0.0, params["doppler_strength"] - 0.03)
        
    if keys[pygame.K_r]:
        params["distortion"] = min(3.0, params["distortion"] + 0.02)
    if keys[pygame.K_f]:
        params["distortion"] = max(0.0, params["distortion"] - 0.02)

    # Dynamic outer/inner boundaries based on Rs
    params["inner_radius"] = params["rs"] * 2.2
    params["outer_radius"] = max(params["inner_radius"] + 2.0, params["outer_radius"])

    # Update Title bar with live stats
    theme_name = THEMES[params["theme_idx"]]["name"]
    pygame.display.set_caption(
        f"Black Hole | Mass (Q/A): {params['rs']:.2f} | Speed (W/S): {params['spin_speed']:.2f} | "
        f"Doppler (E/D): {params['doppler_strength']:.2f} | Lensing (R/F): {params['distortion']:.2f} | Theme: {theme_name}"
    )

    # Auto orbit camera
    if auto_rotate and not dragging:
        cam_phi += 0.003

    # Calculate Camera Position in Spherical Coordinates
    cam_x = cam_dist * math.sin(cam_theta) * math.cos(cam_phi)
    cam_y = cam_dist * math.cos(cam_theta)
    cam_z = cam_dist * math.sin(cam_theta) * math.sin(cam_phi)
    eye = (cam_x, cam_y, cam_z)
    
    # Calculate Camera Orientation vectors
    target = (0.0, 0.0, 0.0)
    up = (0.0, 1.0, 0.0)
    
    # Forward vector (pointing from target to eye, reversed convention)
    z_x, z_y, z_z = eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]
    z_len = math.sqrt(z_x*z_x + z_y*z_y + z_z*z_z)
    zaxis = (z_x / z_len, z_y / z_len, z_z / z_len)
    
    # Right vector = Up x ZAxis
    r_x = up[1]*zaxis[2] - up[2]*zaxis[1]
    r_y = up[2]*zaxis[0] - up[0]*zaxis[2]
    r_z = up[0]*zaxis[1] - up[1]*zaxis[0]
    r_len = math.sqrt(r_x*r_x + r_y*r_y + r_z*r_z)
    xaxis = (r_x / r_len, r_y / r_len, r_z / r_len)
    
    # Actual camera up vector = ZAxis x Right
    yaxis = (
        zaxis[1]*xaxis[2] - zaxis[2]*xaxis[1],
        zaxis[2]*xaxis[0] - zaxis[0]*xaxis[2],
        zaxis[0]*xaxis[1] - zaxis[1]*xaxis[0]
    )

    # Construct uCamWorld matrix (column-major)
    uCamWorld = [
        xaxis[0], xaxis[1], xaxis[2], 0.0,
        yaxis[0], yaxis[1], yaxis[2], 0.0,
        zaxis[0], zaxis[1], zaxis[2], 0.0,
        eye[0],   eye[1],   eye[2],   1.0
    ]

    # Construct uInvProjection matrix (column-major)
    fov = 45.0
    aspect = WIDTH / HEIGHT
    tan_fov = math.tan(math.radians(fov) / 2.0)
    uInvProjection = [
        tan_fov * aspect, 0.0, 0.0, 0.0,
        0.0, tan_fov, 0.0, 0.0,
        0.0, 0.0, 0.0, -1.0,
        0.0, 0.0, -1.0, 0.0
    ]

    # Clear screen
    glClearColor(0.0, 0.0, 0.0, 1.0)
    glClear(GL_COLOR_BUFFER_BIT)
    
    # Set Uniforms
    glUseProgram(program)
    
    glUniform3f(uCamPos_loc, eye[0], eye[1], eye[2])
    glUniformMatrix4fv(uInvProjection_loc, 1, GL_FALSE, uInvProjection)
    glUniformMatrix4fv(uCamWorld_loc, 1, GL_FALSE, uCamWorld)
    
    glUniform1f(uTime_loc, current_time)
    glUniform1f(uRs_loc, params["rs"])
    glUniform1f(uInnerRadius_loc, params["inner_radius"])
    glUniform1f(uOuterRadius_loc, params["outer_radius"])
    glUniform1f(uSpinSpeed_loc, params["spin_speed"])
    glUniform1f(uDopplerStrength_loc, params["doppler_strength"])
    glUniform1f(uNoiseScale_loc, params["noise_scale"])
    glUniform1f(uNoiseDetail_loc, params["noise_detail"])
    glUniform1f(uBeamingScale_loc, params["beaming_scale"])
    glUniform1f(uDistortion_loc, params["distortion"])
    glUniform1f(uStarDensity_loc, params["star_density"])
    
    theme = THEMES[params["theme_idx"]]
    glUniform3f(uColorTheme1_loc, theme["c1"][0], theme["c1"][1], theme["c1"][2])
    glUniform3f(uColorTheme2_loc, theme["c2"][0], theme["c2"][1], theme["c2"][2])

    # Render Screen Quad
    glBindVertexArray(vao)
    glDrawArrays(GL_TRIANGLES, 0, 6)
    glBindVertexArray(0)
    
    pygame.display.flip()

pygame.quit()
