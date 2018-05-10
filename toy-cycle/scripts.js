xs.periodic(1000) // stream every x ms
  .fold(prev => prev + 1, 0)
  .map(i => `Seconds elapsed: ${i}`)
  .subscribe({
    next: str => {
      document.querySelector('#app')
      .textContent = str
    }
  })