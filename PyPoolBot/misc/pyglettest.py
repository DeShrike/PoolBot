# https://pyglet.readthedocs.io/en/pyglet-1.3-maintenance/

import pyglet
from pyglet.window import mouse

window = pyglet.window.Window()

label = pyglet.text.Label('Hello, world',
                          font_name='Times New Roman',
                          font_size=36,
                          x=window.width//2, y=window.height//2,
                          anchor_x='center', anchor_y='center')

@window.event
def on_draw():
    window.clear()
    label.draw()
    pyglet.graphics.draw(2, pyglet.gl.GL_POINTS, ('v2i', (10, 15, 30, 35)) )

@window.event
def on_mouse_press(x, y, button, modifiers):
    if button == mouse.LEFT:
        print('The left mouse button was pressed.')

pyglet.app.run()