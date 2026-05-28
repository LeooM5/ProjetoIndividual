create database projetoPessoal;

use projetoPessoal;

CREATE TABLE usuario (
  idusuario INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(75) NOT NULL,
  senha VARCHAR(25) NOT NULL
);

CREATE TABLE partida (
  idpartida INT PRIMARY KEY AUTO_INCREMENT,
  dataPartida DATE NOT NULL,
  tipoPartida VARCHAR(20) NOT NULL
);

CREATE TABLE estatistica (
  idestatistica INT PRIMARY KEY AUTO_INCREMENT,
  chutesRecebidos INT NOT NULL,
  penaltisPartida INT NOT NULL,
  golsSofridos INT NOT NULL,
  golsPenalti INT NOT NULL,
  fkUsuario INT NOT NULL,
  fkPartida INT NOT NULL,
  CONSTRAINT fkUser FOREIGN KEY(fkUsuario) references usuario(idusuario),
  CONSTRAINT fkPartida FOREIGN KEY(fkPartida) references usuario(idpartida)
  );

truncate estatistica;
truncate partida;
truncate usuario;

select * from usuario;
select * from estatistica;
select * from partida;