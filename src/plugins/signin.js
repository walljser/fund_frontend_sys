export default {
  install(Vue, options) {
    Vue.directive('signin', {
      bind(el, binding, vnode, oldVnode) {
        if (!sessionStorage.getItem('token')) {
          el.style.display = "none"
        } else {
          el.style.display = "block"
        }
      },
      update(el, binding, vnode, oldVnode) {
        if (!sessionStorage.getItem('token')) {
          el.style.dispaly = "none"
        } else {
          el.style.display = "block"
        }
      }
    })

    Vue.directive('signout', {
      bind(el, binding, vnode, oldVnode) {
        if (sessionStorage.getItem('token')) {
          el.style.display = "none"
        } else {
          el.style.display = "block"
        }
      },
      update(el, binding, vnode, oldVnode) {
        if (sessionStorage.getItem('token')) {
          el.style.display = "none"
        } else {
          el.style.display = "block"
        }
      }
    })

    Vue.prototype.$isSignin = function () {
      return sessionStorage.getItem('token') ? true : false
    }
  }
}
